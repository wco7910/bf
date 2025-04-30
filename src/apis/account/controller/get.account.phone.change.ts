import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'Phone Dup Check';

export const request = {
  path: '/account/edit/phone',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    phone: {
      type: 'string',
      description: '',
      example: '01011111111',
    },
  },
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
    req['user'];
    const result = await AccountService.phoneDuplicateForRe(
      String(req.query?.phone),
      req['user'].id
    );
    if (result) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: `${req.query.phone.toString()}은(는) 사용 가능한 핸드폰 번호 입니다.`,
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'DUPLICATE_NUMBER',
      code: 400,
      error: {
        code: 400,
        message: `${req.query.phone.toString()}은(는) 이미 사용중인 핸드폰 번호 입니다..`,
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
