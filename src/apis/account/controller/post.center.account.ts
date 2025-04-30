import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'center signup';

export const request = {
  path: '/account/center',
  method: 'post',
};

export const dto = 'createAccount';

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
    centerName: {
      type: 'string',
      description: '',
      example: '부산 센터 본점',
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
    ipAddress: {
      type: 'string',
      description: '',
      example: '113.124.122.11',
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
    const result = await AccountService.createCenter(req.body);
    if(result == 'ok') {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          name: req.body.name,
          role: req.body.role,
          center: req.body.centerName,
          message: 'OK',
        },
      });
    } else {
      return res.json({
        version: process.env?.API_VERSION,
        message: result,
        code: 400,
      });
    }
  } catch (error) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'SIGN_UP_FAIL',
      code: 400,
      error: {
        code: 400,
        message: error,
      },
    });
  }
};

export default execute;
