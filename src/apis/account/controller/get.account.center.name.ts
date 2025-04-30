import { NextFunction, Request, Response } from 'express';
import { CenterService } from '../../center/service/s.center';
export const tags = ['Account'];
export const summary = 'centerName dup check';

export const request = {
  path: '/account/centername',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    name: {
      type: 'string',
      description: '',
      example: 'aaa@aaa.com',
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
    const result = await CenterService.centerDuplicateCheck(
      String(req.query?.name)
    );
    if (result == 0) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '가입 가능한 센터 이름입니다',
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Existing Name',
      code: 400,
      error: {
        code: 400,
        message: '이미 존재하는 센터 이름입니다.',
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Error',
      code: 400,
      error: {
        code: 400,
        message: '잠시 후 다시 시도해 주세요.',
      },
    });
  }
};

export default execute;
