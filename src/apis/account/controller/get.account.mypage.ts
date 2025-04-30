import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repository/r.account';
export const tags = ['Account'];
export const summary = 'My Page Init';

export const request = {
  path: '/account/mypage',
  method: 'get',
};

export const params = {
  path: {},
  query: {},
  body: {},
  form: {},
};

export const security = ['ROLE'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await accountRepository.getMyPage(req['user'].id);
    if (account == null) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'NOT FOUND',
        code: 400,
        error: {
          code: 400,
          message: '유저의 프로파일을 불러오는데 실패했습니다.',
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        account: account,
        message: 'OK',
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
        message: '유저의 프로파일을 불러오는데 중 오류가 발생했습니다.',
      },
    });
  }
};

export default execute;
