import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'passowrd validation';

export const request = {
  path: '/account/password',
  method: 'post',
};

export const dto = 'validatePassword';

export const params = {
  path: {},
  query: {},
  body: {
    email: {},
    password: {},
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
    const result = await AccountService.validatePassword(
      req.body.password,
      req.body.email
    );

    if (result) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '사용 가능한 비밀번호',
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'INVALID_PASSWORD',
      code: 400,
      error: {
        code: 400,
        message: '기존에 사용하던 비밀번호와 같습니다.',
      },
    });
  } catch (err) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Error',
      code: 403,
      error: {
        code: 403,
        message: '비밀번호 확인 중 오류가 발생했습니다.',
      },
    });
  }
};

export default execute;
