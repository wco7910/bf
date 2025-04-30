import { NextFunction, Request, Response } from 'express';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'Search Sequence';
export const request = {
  path: '/sequence/search',
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
    const account = req['user'];
    const sequences = await SequenceService.getAll(account.id);
    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        sequence: sequences,
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
