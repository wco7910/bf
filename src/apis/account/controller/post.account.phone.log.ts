import { NextFunction, Request, Response } from 'express';
import { activityLogRepository } from '../../log/repository/r.activity.log';
import { AccountPhoneAuthLogService } from '../service/s.account.phone.auth.log';
export const tags = ['Account'];
export const summary = 'phone log';

export const request = {
  path: '/account/phone',
  method: 'post',
};

export const dto = 'postPhoneLog';

export const params = {
  path: {},
  query: {},
  body: {
    phone: {
      type: 'string',
      description: '',
      example: '01011111111',
    },
    purpose: {
      type: 'string',
      description: '',
      example: 'signUp',
    },
  },
  form: {},
};

export const security = ['ANY'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phone = req.body.phone;
    const count = await AccountPhoneAuthLogService.countValidate(phone);
    if (count < 5) {
      const result = await AccountPhoneAuthLogService.create(
        phone,
        req.body.purpose
      );
      if (result) {
        return res.json({
          version: process.env?.API_VERSION,
          message: 'OK',
          payload: {
            message: '다음페이지로',
          },
        });
      }
      throw Error;
    } else {
      throw Error('Too Many Trials');
    }
  } catch (error) {
    if (error.message == 'Too Many Trials')
      return res.json({
        version: process.env?.API_VERSION,
        message: 'NOT FOUND',
        code: 403,
        error: {
          code: 403,
          message: '5회 이상 시도',
        },
      });
    await activityLogRepository.save({
      content: error,
    });
    return res.json({
      version: process.env?.API_VERSION,
      message: 'NOT FOUND',
      code: 400,
      error: {
        code: 400,
        message: '인증 생성에 실패',
      },
    });
  }
};

export default execute;
