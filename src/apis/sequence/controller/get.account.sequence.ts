import { NextFunction, Request, Response } from 'express';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'Sequence With Pagination';
export const request = {
  path: '/sequence/my',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    pageNum: {
      type: 'string',
      description: '',
      example: '1',
    },
    sort: {
      type: 'string',
      description: '',
      example: 'DESC',
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
    // console.log(req['user'])
    const account = req['user'];
    const sequences = await SequenceService.getList(
      req.query.pageNum,
      req.query.sort,
      account.id
    );
    const totalPages =
      sequences[1] % 10 == 0
        ? (sequences[1] / 10) | 0
        : ((sequences[1] / 10) | 0) + 1;

    
      // console.log(sequences[0])
      // console.log(totalPages)
    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        sequence: sequences[0],
        totalPages: totalPages,
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
