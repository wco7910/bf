import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Admin'];
export const summary = 'Get Trainer List by Admin';

//추후 앞단을 어디민으로 수정할것
export const request = {
  path: '/admin/trainer',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    account_name: {},
    pageNum: {
      type: 'number',
      description: '페이지 넘버',
      example: '1',
    },
    orderBy: {
      type: 'string',
      description: '정령할 기준',
    },
    sort: {
      type: 'string',
      description: 'ASC, DESC',
      example: 'ASC',
    },
    centerId: {},
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
    const pageNum = req.query?.pageNum;
    const orderBy = req.query.orderBy;
    const sort = req.query?.sort;
    const searchTxt = req.query?.searchTxt;

    const trainerList = await AccountService.getTrainerList(
      pageNum,
      orderBy,
      sort,
      searchTxt
    );
    if (trainerList.trainerList == null) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'INFO_NOT_FOUND',
        code: 404,
        error: {
          code: 404,
          message: '트레이너 목록을 불러오는데 실패했습니다.',
        },
      });
    }
    const totalPages =
      trainerList.totalTrainer % 10 == 0
        ? (trainerList.totalTrainer / 10) | 0
        : ((trainerList.totalTrainer / 10) | 0) + 1;

    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        trainerList: trainerList.trainerList,
        totalCount: trainerList.totalTrainer,
        totalPages: totalPages,
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
