import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
import { AccountPhoneAuthLogService } from '../service/s.account.phone.auth.log';
export const tags = ['Account'];
export const summary = 'update password';

export const request = {
  path: '/account/password',
  method: 'patch',
};

export const dto = 'updatePassword';

export const params = {
  path: {},
  query: {},
  body: {
    phone: {
      type: 'string',
      description: '',
      example: '01011111111',
    },
    authNumber: {
      type: 'string',
      description: '',
      example: '',
    },
    password: {
      type: 'string',
      description: '',
      example: '',
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
    const result = await AccountPhoneAuthLogService.phoneLogValidate(
      phone,
      req.body.authNumber,
      'resetPassWord'
    );
    if (!result) {
      throw Error();
    }
    const update = await AccountService.updatePassword(
      phone,
      req.body.password
    );
    if (update.affected < 1) {
      throw Error();
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        message: '변경 성공',
      },
    });
  } catch (err) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'UPDATE_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '변경 실패',
      },
    });
  }
};

export default execute;
