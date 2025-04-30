import axios from 'axios';

import { Between, MoreThan } from 'typeorm';
import { accountPhoneAuthLogRepository } from '../repository/r.account.phone.log';
import { dayjsTz } from '#/ready2start/dayjs.timezone';

export const AccountPhoneAuthLogService = {
  sendMessage: async (phone: string, code: string) => {
    return await axios
      .post('https://apis.aligo.in/send/', null, {
        params: {
          key: process.env.ALIGO_KEY,
          user_id: process.env.ALIGO_ID,
          sender: process.env.ALIGO_SENDER,
          receiver: `${phone}`,
          msg: `인증번호는 [${code}] 입니다`,
          msg_type: 'SMS',
          //testmode_yn: process.env.NODE_ENV == 'development' ? 'Y' : 'N',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  },
  create: async (phone: string, purpose: string) => {
    let str = '';
    for (let i = 0; i < 4; i++) {
      str += Math.floor(Math.random() * 10);
    }
    const log = accountPhoneAuthLogRepository.create();
    log.authNumber = str;
    log.phone = phone;
    log.purpose = purpose;
    log.expiredAt = dayjsTz
      .tz(new Date(), 'Asia/Seoul')
      .add(15, 'minutes')
      .toDate();
    try {
      const messageResult = await AccountPhoneAuthLogService.sendMessage(
        phone,
        str
      );
      console.log(messageResult);
      if (messageResult.success_cnt == null || messageResult.success_cnt != 1) {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
    const result = await accountPhoneAuthLogRepository.save(log);
    if (result) {
      return true;
    }
    return false;
  },
  update: async (phone: string, authNumber: string, purpose: string) => {
    const log = await accountPhoneAuthLogRepository.findOne({
      where: {
        phone: phone,
        authNumber: authNumber,
        purpose: purpose,
        expiredAt: MoreThan(new Date()),
      },
    });
    if (!log) {
      return false;
    }
    const result = await accountPhoneAuthLogRepository.update(log.id, {
      updatedAt: new Date(),
      isSuccess: 'Y',
      enable: 'Y',
    });

    if (result.affected < 1) {
      return false;
    }

    return true;
  },
  phoneLogValidate: async (
    phone: string,
    authNumber: string,
    puspose: string
  ) => {
    try {
      const result = await accountPhoneAuthLogRepository.findOne({
        where: {
          isSuccess: 'Y',
          enable: 'Y',
          phone: phone,
          authNumber: authNumber,
          purpose: puspose,
        },
      });
      if (result == null) {
        throw Error();
      }
      const update = await accountPhoneAuthLogRepository.update(result.id, {
        enable: 'N',
      });
      if (update.affected < 1) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  countValidate: async (phone: string) => {
    const count = await accountPhoneAuthLogRepository.count({
      where: {
        phone: phone,
        createdAt: Between(
          dayjsTz.tz(new Date(), 'Asia/Seoul').startOf('D').toDate(),
          new Date()
        ),
      },
    });
    return count;
  },
};
