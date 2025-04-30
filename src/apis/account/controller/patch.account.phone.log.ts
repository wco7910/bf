import { NextFunction, Request, Response } from 'express';
import { AccountPhoneAuthLogService } from '../service/s.account.phone.auth.log';
export const tags = ['Account'];
export const summary = 'phone log verifying';

export const request = {
  path: '/account/phone',
  method: 'patch',
};

export const dto = 'updatePhoneLog';

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
    console.log(req.body);
    const result = await AccountPhoneAuthLogService.update(
      phone,
      req.body.authNumber,
      req.body.purpose
    );
    if (result) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        paylad: {
          message: '다음페이지로',
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'AUTH_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '인증 생성에 실패했습니다..',
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Error',
      code: 403,
      error: {
        code: 403,
        message: '오류가 발생했습니다.',
      },
    });
  }
};

export default execute;
