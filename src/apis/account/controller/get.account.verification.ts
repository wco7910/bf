import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'Verify Info Before Change Password';

export const request = {
  path: '/account/verify',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    email: {},
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
    if(req?.query?.carrier == 'LG' || req?.query?.carrier == 'LG U%2B') {
      req.query.carrier = 'LG U+'
    }
    console.log(req.query.carrier)
    const count = await AccountService.userVerify(req.query);
    if (count == 1) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: { message: '옳바른 정보 입니다.' },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'USER_NOT_FOUND',
      code: 404,
      error: {
        code: 404,
        message: '해당 정보로 가입된 회원 정보가 없습니다.',
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
