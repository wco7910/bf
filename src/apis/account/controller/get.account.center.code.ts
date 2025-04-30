import { NextFunction, Request, Response } from 'express';
import { CenterService } from '../../center/service/s.center';
export const tags = ['Account'];
export const summary = 'email dup check';

export const request = {
  path: '/account/centerCode',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    centerCode: {
      type: 'string',
      description: '',
      example: '',
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
    const result = await CenterService.identifierCheck(
      String(req.query?.centerCode)
    );
    if (result != 0) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '인증에 성공했습니다.',
        },
      });
    }
    throw Error('INVALID_REQUEST');
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Invalid_Auth_Code|| Max_Trainer ',
      code: 400,
      error: {
        code: 400,
        message: '잘못된 인증번호 or 최대 트레이너 등록수에 도달했습니다.',
      },
    });
  }
};

export default execute;
