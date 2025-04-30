import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'trainer signup';

export const request = {
  path: '/account/trainer',
  method: 'post',
};

export const dto = 'createTrainer';

export const params = {
  path: {},
  query: {},
  body: {
    name: {
      type: 'string',
      description: '',
      example: '정한겸',
    },
    carrier: {
      type: 'string',
      description: '',
      example: 'SKT',
    },
    phone: {
      type: 'string',
      description: '',
      example: '01011111111',
    },
    centerCode: {
      type: 'string',
      description: '',
      example: '',
    },
    email: {
      type: 'string',
      description: '',
      example: 'aaa@aaa.com',
    },
    password: {
      type: 'string',
      description: '',
      example: '123123',
    },
    authCode: {
      type: 'string',
      description: '',
      example: '5123',
    },
    marketingOption: {
      type: 'string',
      description: '',
      example: 'T',
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
    const centerName = await AccountService.createTrainer(req.body);
    if (centerName == false) {
      throw Error();
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        name: req.body.name,
        role: req.body.role,
        center: centerName,
        message: 'OK',
      },
    });
  } catch (error) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'SIGN_UP_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '계정 생성 중 오류가 발생했습니다.',
      },
    });
  }
};

export default execute;
