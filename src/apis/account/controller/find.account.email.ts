import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'Find Email';

export const request = {
  path: '/account/find/email',
  method: 'post',
};

export const dto = 'findEmail';

export const params = {
  path: {},
  query: {},
  body: {
    phone: {
      type: 'string',
      description: '',
      example: '',
    },
    carrier: {
      type: 'string',
      description: '',
      example: 'SKT',
    },
    name: {
      type: 'string',
      description: '',
      example: '정한겸',
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
    const account = await AccountService.findEmail(req.body);
    if (account?.email != null) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: { email: account.email },
      });
    }
    throw Error('USER_NOT_FOUND');
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'USER_NOT_FOUND',
      code: 404,
      error: {
        code: 404,
        message: '해당 정보로 가입된 회원 정보가 없습니다.',
      },
    });
  }
};

export default execute;
