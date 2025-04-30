import { g_DataSource } from '#/ready2start/database';
import { NextFunction, Request, Response } from 'express';
import { File } from '../../file/entity/e.file';
import { UpdateAdminDto } from '../dto/update.admin.dto';
import { Account } from '../entity/e.account';
import { accountRepository } from '../repository/r.account';
import { AccountService } from '../service/s.account';
export const tags = ['Admin'];
export const summary = 'Edit Mypage';

export const request = {
  path: '/admin/account',
  method: 'patch',
};

export const dto = 'patchAdmin';

export const params = {
  path: {},
  query: {},
  body: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    info: {
      type: 'object',
      description: '회사 정보가 들어간다',
    },
  },
  form: {},
};

export const security = ['ROLE'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = req.body;
  if (params.password != null) {
    params.password = await AccountService.encryptPassword(params.password);
  }
  const runner = g_DataSource.createQueryRunner();
  await runner.startTransaction();
  try {
    const file_id = params.photoKey;
    const dto = new UpdateAdminDto(params);
    dto['etc'] = params.info;
    const account = await accountRepository.findOne({
      where: {
        role: 'admin',
      },
    });
    const result = await runner.manager.update(
      Account,
      {
        //email: req.body.email,
        role: 'admin',
      },
      dto
    );
    await runner.manager.update(File, file_id, {
      isUsed: 'T',
      service: 'profile',
      serviceId: account.id,
    });
    if (result.affected != 1) throw Error();
    await runner.commitTransaction();
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        message: '업데이트 성공',
      },
    });
  } catch (err) {
    console.log(err);
    await runner.rollbackTransaction();
    return res.json({
      version: process.env?.API_VERSION,
      message: 'UPDATE_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '업데이트 실패',
      },
    });
  } finally {
    await runner.release();
  }
};

export default execute;
