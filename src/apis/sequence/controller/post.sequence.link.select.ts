import { NextFunction, Request, Response } from 'express';
import { sequenceRepository } from '../repository/r.sequence';

export const tags = ['Sequence'];
export const summary = 'select sequence link';
export const request = {
  path: '/sequence/link/select',
  method: 'post',
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
    const now = new Date();
    const offset = 1000 * 60 * 60 * 9
    let expire;

    // await runner.connect();
    // const _sequence = await runner.manager.findOne(Sequence, {
    //     where: {
    //         id: req.body.id,
    //       },
    // });
    // await runner.release();


    const _sequence = await sequenceRepository.findOne({
        where: {
            id: req.body.id,
          },
    });

    if(_sequence.linkEndDate != null && _sequence.linkEndDate > now) {
      _sequence.linkEndDate > new Date() ? expire = '사용가능' : expire = '만료'
      const koreaTime = new Date(_sequence.linkEndDate.getTime() + offset);
  
      return res.json({
          version: process.env?.API_VERSION,
          message: 'OK',
          payload: {
              linkId: 'https://sequence.humanb.kr/sequence/link/' + _sequence.linkId,
              linkEndDate: koreaTime.toISOString().replace("T", " ").split('.')[0],
              expire: expire,
              message: 'OK',
          },
      });
    } else {
      return res.json({
          version: process.env?.API_VERSION,
          message: 'OK',
          payload: {
              linkId: null,
              linkEndDate: null,
              expire: null,
              message: 'OK',
          },
      });
    }

  } catch (err) {
    // await runner.rollbackTransaction();
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
