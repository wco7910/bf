import { NextFunction, Request, Response } from 'express';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Admin'];
export const summary = 'Search Sequence';
export const request = {
  path: '/admin/sequence',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    centerId: {},
    accountId: {},
    pageNum: {},
    orderBy: {},
    sort: {},
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
    const sequences = await SequenceService.adminList(
      req.query.pageNum,
      req.query.accountId,
      req.query.centerId,
      req.query.orderBy,
      req.query.sort
    );
    const totalCount: number = Number(sequences[1]);
    const totalPages =
      totalCount % 10 == 0
        ? (totalCount / 10) | 0
        : ((totalCount / 10) | 0) + 1;

    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        sequence: sequences[0],
        totalPages,
        totalCount,
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
