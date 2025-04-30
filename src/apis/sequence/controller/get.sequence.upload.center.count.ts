import { NextFunction, Request, Response } from 'express';
import { centerRepository } from '../../center/repository/r.center';

export const tags = ['Sequence'];
export const summary = 'Search Sequence';
export const request = {
  path: '/sequence/upload/center',
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
    const result = await centerRepository.getUploadSequenceCount();
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        result,
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
        message: '오류가 발생했습니다.',
      },
    });
  }
};
export default execute;
