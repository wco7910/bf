import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repository/r.account';
export const tags = ['Account'];
export const summary = 'Get Company Info';

export const request = {
  path: '/account/companyinfo',
  method: 'get',
};

export const params = {
  path: {},
  query: {},
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
    const info = await accountRepository.findOne({
      where: {
        role: 'admin',
      },
      select: {
        etc: true,
      },
    });

    return res.json({
      companyInfo: info.etc,
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
