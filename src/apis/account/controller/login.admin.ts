import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
import { SimpleConsoleLogger } from 'typeorm';
export const tags = ['Admin'];
export const summary = 'Admin Login';

export const request = {
  path: '/admin/signin',
  method: 'post',
};

export const dto = 'adminLogin';

export const params = {
  path: {},
  query: {},
  body: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
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
    const result = await AccountService.adminLogin(
      req.body.email,
      req.body.password
    );

    if (result[0] == null) {
      // if(req.body.email != 'cy') {
        throw Error;
      // }
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        access_token: result[0],
        refresh_token: result[1],
        expired_at: result[2],
        type: 'Bearer',
      },
    });
  } catch (error) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'USER_NOT_FOUND || UNAUTHORIZED_USER',
      code: 404,
      error: {
        code: 404,
        message: '로그인에 실패했습니다.',
      },
    });
  }
};

export default execute;
