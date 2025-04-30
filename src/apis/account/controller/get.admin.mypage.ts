import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repository/r.account';
export const tags = ['Admin'];
export const summary = 'Get Admin Mypage';

export const request = {
  path: '/admin/mypage',
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
    const mypage = await accountRepository.getMyPage(req['user'].id);
    const info = await accountRepository.findOne({
      where: {
        role: 'admin',
      },
    });

    mypage.info = info.etc;

    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        account: mypage,
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
