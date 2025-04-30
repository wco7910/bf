import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'email dup check';

export const request = {
  path: '/account/email',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    email: {
      type: 'string',
      description: '',
      example: 'aaa@aaa.com',
    },
  },
  body: {},
  form: {},
};

export const security = ['ANY'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AccountService.emailDuplicate(
      String(req.query?.email)
    );
    if (result) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: `${req.query.email.toString()}은(는) 사용 가능한 이메일 입니다.`,
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'DUPLICATE_EMAIL',
      code: 400,
      error: {
        code: 400,
        message: `${req.query.email.toString()}은(는) 이미 사용중인 이메일 입니다.`,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Error',
      code: 400,
      error: {
        code: 400,
        message: '잠시 후 다시 시도해 주세요.',
      },
    });
  }
};

export default execute;
