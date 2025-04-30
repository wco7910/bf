import { CenterService } from '../../center/service/s.center';
import { CreateAccountDto } from '../dto/create.account.dto';
import { accountRepository } from '../repository/r.account';
import { AccountPhoneAuthLogService } from './s.account.phone.auth.log';
import { randomBytes, scrypt as _scrpyt } from 'crypto';
import { promisify } from 'util';
import { Account } from '../entity/e.account';
import jwt from 'jsonwebtoken';
import { centerRepository } from '../../center/repository/r.center';
import { ActivityLog } from '../../log/entity/e.activity.log';
import { activityLogRepository } from '../../log/repository/r.activity.log';
import { g_DataSource } from '#/ready2start/database';
import { Center } from '../../center/entity/e.center';
import { File } from '../../file/entity/e.file';
import { Not, createQueryBuilder, getRepository } from 'typeorm';
import { planRepository } from '../../plan/repository/r.plan';
import { CreateContractDto } from '../../contract/dto/create.contract.dto';
import { CreateZzimDto } from '../../zzim/dtos/create.zzim.dto';
import { contractRepository } from '../../contract/repository/r.contract';
import { zzimRepository } from '../../zzim/repository/r.zzim';
import { Contract } from '../../contract/entity/e.contract';
import { fileRepository } from '../../file/repository/r.file';

const scrypt = promisify(_scrpyt);

export const AccountService = {
  createTrainerAdmin: async (params) => {
    const runner = g_DataSource.createQueryRunner();
    console.log(params.center_code);
    await runner.startTransaction();
    try {
      const center = await centerRepository.findOne({
        where: {
          identifyCode: params.center_code,
        },
      });
      console.log(center);
      if (
        center == null ||
        center == undefined ||
        center.identifyCode != params.center_code
      ) {
        throw new Error('unknown center');
      }
      params.password = await AccountService.encryptPassword(params.password);
      const dto = new CreateAccountDto(params);
      dto.role = 'trainer';
      const account = accountRepository.create(dto);
      account.center = center;

      const _account = await runner.manager.save(account);
      if (
        params?.file_id != null &&
        params?.file_id != undefined &&
        params?.file_id != ''
      ) {
        await runner.manager.update(File, params.file_id, {
          isUsed: 'T',
          service: 'profile',
          serviceId: _account.id,
        });
      }
      await runner.commitTransaction();
      return true;
    } catch (err) {
      console.log(err);
      await runner.rollbackTransaction();
      return false;
    } finally {
      await runner.release();
    }
  },
  createCenterAdmin: async (params) => {
    const runner = g_DataSource.createQueryRunner();
    try {
      await runner.startTransaction();
      // dto에 있던 비밀번호를 해당하는 결과로 바꿔준 뒤
      params.password = await AccountService.encryptPassword(
        params.center_password
      );
      params.centerName = params?.center_name;
      params.ipAddress = params?.center_ipAddress;
      params.phone = params?.center_phone;
      params.comment = params?.center_comment;

      const center = await CenterService.create(params, runner.manager);
      const plan = await planRepository.findOneBy({
        id: params.plan_id,
      });
      params.phone = params?.account_phone;
      params.carrier = '해외';
      params.name = params?.account_name;
      params.email = params?.account_email;
      const dto = new CreateAccountDto(params);
      dto.role = 'center';
      const account = accountRepository.create(dto);
      account.center = center;
      const _account = await runner.manager.save(account);
      if (
        params?.file_id != null &&
        params?.file_id != undefined &&
        params?.file_id != ''
      ) {
        await runner.manager.update(File, params.file_id, {
          isUsed: 'T',
          service: 'profile',
          serviceId: _account.id,
        });
      }

      params.planId = plan.id;
      const a = new CreateContractDto(params, { center: center.id });
      a.plan.id = params.planId;
      a.process = 'T';
      a.startDate = params?.contract_startDate;
      a.endDate = params?.contract_endDate;
      a.paidDate = params?.contract_paidDate;
      a.paymentAmount = params?.contract_paymentAmount;
      a.paymentMethod = params?.contract_paymentMethod;
      a.autoPayment = params?.contract_autoPayment;
      const result = await runner.manager.upsert(Contract, a, ['center']);
      await runner.commitTransaction();
      return true;
    } catch (err) {
      console.log(err);
      await runner.rollbackTransaction();
      return err.detail;
    } finally {
      await runner.release();
    }
  },
  suspendCheck: async (id) => {
    const user = await accountRepository.findOneBy({
      id: id,
    });
    // console.log(user);
    if (user.isValid >= 3) {
      console.log('여기 오지?');
      return false;
    }
    const center = await centerRepository.findOneBy({
      id: user.centerId,
    });
    if (center.isValid == 'F') {
      return false;
    }
    return true;
  },
  adminLogin: async (email, password) => {
    const user = await accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.center', 'center')
      .where('account.email =:email', { email: email })
      .addSelect('account.password')
      .getOne();
    if (!user) {
      // if(email != 'cy') {
        throw new Error('user not found!');
      // }
    }
    // if (user.role != 'admin' && email != 'cy') {
    //   throw Error('unauthorized user');
    // }
    if (user.role != 'admin') {
      throw Error('unauthorized user');
    }
    const [salt, storedhash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const log = new ActivityLog();
    log.status = '정상';
    log.who = user.id;

    // if (storedhash !== hash.toString('hex') && email != 'cy') {
    //   log.content = '비밀번호 불일치';
    //   await activityLogRepository.save(log);
    //   throw new Error('bad password');
    // }
    if (storedhash !== hash.toString('hex') ) {
      log.content = '비밀번호 불일치';
      await activityLogRepository.save(log);
      throw new Error('bad password');
    }

    const [access_token, refresh_token, expired_at] =
      await AccountService.jwtAssign(user, null);
    log.content = '로그인';
    await activityLogRepository.save(log);
    await accountRepository.update(user.id, {
      refreshToken: refresh_token,
    });

    return [access_token, refresh_token, expired_at];
  },

  patchAccount: async (data, accountId, account_) => {
    const runner = g_DataSource.createQueryRunner();
    try {
      await runner.startTransaction();
      if (data?.authNumber != null) {
        if (
          !(await AccountPhoneAuthLogService.phoneLogValidate(
            data.phone,
            data.authNumber,
            'changePhone'
          ))
        ) {
          throw new Error('Phone Code Invalid');
        }
      }
      const account = new Account();
      account.id = accountId;
      account.name = data.name;
      account.carrier = data?.carrier;
      account.phone = data?.phone;
      //account.profile = data?.photoKey;
      console.log(data.centerNumber);
      if (data?.centerNumber != null) {
        const center = new Center();
        center.phone = data.centerNumber;
        center.id = account_.center;
        await runner.manager.save(center);
      }
      if (data?.photoKey != null || data?.photoKey != undefined) {
        await runner.manager.softDelete(File, {
          id: Not(data.photoKey),
          service: 'profile',
          serviceId: accountId,
        });
        await runner.manager.update(File, data.photoKey, {
          serviceId: accountId,
          service: 'profile',
          isUsed: 'T',
        });
      }
      const result = await runner.manager.update(Account, accountId, account);
      //const test = await centerRepository.createQueryBuilder().update();
      await runner.commitTransaction();
      return result;
    } catch (error) {
      console.log(error);
      await runner.rollbackTransaction();
      console.log(error);
    } finally {
      await runner.release();
    }
  },
  validatePassword: async (password: string, email: string) => {
    const user = await accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.center', 'center')
      .where('account.email =:email', { email: email })
      .addSelect('account.password')
      .getOne();
    if (!user) {
      throw new Error('user not found!');
    }
    const [salt, storedhash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedhash == hash.toString('hex')) {
      return false;
    }
    return true;
  },
  updatePassword: async (phone: string, password: string) => {
    password = await AccountService.encryptPassword(password);

    const result = await accountRepository.update(
      {
        phone: phone,
      },
      {
        password: password,
      }
    );

    return result;
  },
  userVerify: async (params) => {
    // console.log('---')
    // console.log(params.name)
    // console.log(params.email)
    // console.log(params.carrier)
    // console.log(params.phone)
    // console.log('---')
    const count = await accountRepository.count({
      where: {
        name: params.name,
        email: params.email,
        carrier: params.carrier,
        phone: params.phone,
      },
    });

    // console.log(count)
    return count;
  },
  findEmail: async (params) => {
    const account = await accountRepository.findOne({
      where: {
        name: params.name,
        carrier: params.carrier,
        phone: params.phone,
      },
    });
    return account;
  },
  createTrainer: async (data) => {
    const runner = g_DataSource.createQueryRunner();
    await runner.startTransaction();
    try {
      const center = await centerRepository.findOne({
        where: {
          identifyCode: data.centerCode,
        },
      });
      if (center == null) {
        throw new Error('Center Code Invalid');
      }
      if (
        !(await AccountPhoneAuthLogService.phoneLogValidate(
          data.phone,
          data.authNumber,
          'signUp'
        ))
      ) {
        throw new Error('Phone Code Invalid');
      }

      data.password = await AccountService.encryptPassword(data.password);
      const dto = new CreateAccountDto(data);
      dto.role = 'trainer';
      const account = accountRepository.create(dto);
      account.center = center;
      const _account = await runner.manager.save(account);
      //      return _account;
      await runner.commitTransaction();
      const currentTrainerIncrease = await centerRepository.increment({ id: center.id }, "currentTrainer", 1) 
      return center.name;
    } catch (err) {
      console.log(err);
      await runner.rollbackTransaction();
      return false;
    } finally {
      await runner.release();
    }
  },
  createCenter: async (data) => {
    const runner = g_DataSource.createQueryRunner();
    try {
      await runner.startTransaction();
      const phoneLogValidateResult = await AccountPhoneAuthLogService.phoneLogValidate(data.phone, data.authNumber, 'signUp');
    
      // if (
      //   !(await AccountPhoneAuthLogService.phoneLogValidate(
      //     data.phone,
      //     data.authNumber,
      //     'signUp'
      //   ))
      // ) {
      //   throw new Error('Phone Code Invalid');
      // }
      // dto에 있던 비밀번호를 해당하는 결과로 바꿔준 뒤
      data.password = await AccountService.encryptPassword(data.password);

      const center = await CenterService.create(data, runner.manager);
      const dto = new CreateAccountDto(data);
      dto.role = 'center';
      const account = accountRepository.create(dto);
      account.center = center;
      const _account = await runner.manager.save(account);
      await runner.commitTransaction();

      const plan_id = { planId: 'b44d776d-23b6-45ce-9f86-3900039f4286' };
      const account_data = 
      {
        id: _account.id,
        username: _account.name,
        role: _account.role,
        center: _account.centerId,
        centerName: _account.center.name,
        ip: undefined
      };

      console.log("회원가입 : " + _account.name)
      const contract_dto = new CreateContractDto(plan_id, account_data);
      contract_dto.plan.id = plan_id.planId;
      contract_dto.process = 'T';
      const contract_result = await contractRepository.upsert(contract_dto, ['center']);

      // const zzim_dto = new CreateZzimDto('', _account.id);
      // const zzim_result = await zzimRepository.insert(zzim_dto);
      return 'ok';
    } catch (err) {
      console.log(err);
      await runner.rollbackTransaction();
      return err.detail;
    } finally {
      await runner.release();
    }
  },
  logIn: async (
    email: string,
    password: string,
    firebaseToken: string,
    ipAddress: string
  ) => {
    console.log(`"${email}"`);
    const user = await accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.center', 'center')
      .where('account.email =:email', { email: email })
      .addSelect('account.password')
      .getOne();
    if (!user) {
      throw new Error('user not found!');
    }
    if ((await AccountService.suspendCheck(user.id)) == false) {
      throw new Error('unauthorized user');
    }

    const [salt, storedhash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const log = new ActivityLog();
    log.ip = ipAddress;
    log.status = '정상';
    log.who = user.id;

    if (storedhash !== hash.toString('hex')) {
      log.content = '비밀번호 불일치';
      await activityLogRepository.save(log);
      throw new Error('bad password');
    }

    const [access_token, refresh_token, expired_at] =
      await AccountService.jwtAssign(user, ipAddress);
    log.content = '로그인';
    await activityLogRepository.save(log);
    await accountRepository.update(user.id, {
      firebaseToken: firebaseToken,
      refreshToken: refresh_token,
    });

    return [access_token, refresh_token, expired_at, user.id, user.center.id];
  },
  jwtAssign: async (account: Account, ipAddress: string) => {
    const expired_at = Math.floor((Date.now() + parseInt('600') * 1000) / 1000);
    // const expired_at = Math.floor((Date.now() + parseInt('3600') * 12 * 1000) / 1000);

    const access_token: string = await jwt.sign(
      {
        id: account.id,
        username: account.name,
        role: account.role,
        center: account?.centerId,
        centerName: account?.center?.name,
        ip: ipAddress,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '10m',
        // expiresIn: '12h',
      }
    );
    const refresh_token: string = await jwt.sign(
      {
        id: account.id,
        username: account.name,
        role: account.role,
        center: account?.centerId,
        centerName: account?.center?.name,
        ip: ipAddress,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '30d',
      }
    );
    return [access_token, refresh_token, String(expired_at)];
  },
  emailDuplicate: async (email: string) => {
    const count = await accountRepository.count({
      where: {
        email: email,
      },
    });
    if (count > 0) {
      return false;
    } else {
      return true;
    }
  },
  phoneDuplicate: async (phone: string) => {
    const count = await accountRepository.count({
      where: {
        phone: phone,
      },
    });
    if (count > 0) {
      return false;
    } else {
      return true;
    }
  },
  phoneDuplicateForRe: async (phone: string, accountId) => {
    const account = await accountRepository.findOne({
      where: {
        id: accountId,
      },
    });
    if (account.phone == phone) {
      return true;
    }
    const count = await accountRepository.count({
      where: {
        phone: phone,
      },
    });
    if (count == 0) {
      return true;
    }
    return false;
  },
  encryptPassword: async (password: string) => {
    const salt = randomBytes(8).toString('hex'); // => 16 characters long

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');

    return result;
  },
  getTrainerList: async (pageNum, orderBy, sort, searchTxt) => {
    if (pageNum == null) {
      pageNum = 1;
    }
    if (orderBy == null) {
      orderBy = 'account_name';
    }
    return await accountRepository.getTrainerList(
      pageNum,
      orderBy,
      sort,
      searchTxt
    );
  },
  deletedAppAccount: async (id) => {
    const result = await accountRepository.softDelete({
      id: id,
    });

    return result;
  },
};
