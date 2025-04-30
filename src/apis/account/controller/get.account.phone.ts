import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'Phone Dup Check';

export const request = {
  path: '/account/phone',
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

export const security = ['ANY'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AccountService.phoneDuplicate(
      String(req.query?.phone)
    );
    if (result) {
      return res.status(200).json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: `${req.query.phone.toString()}은(는) 사용 가능한 핸드폰 번호 입니다.`,
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'DUPLOCATE_NUMBER',
      code: 400,
      errors: {
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
