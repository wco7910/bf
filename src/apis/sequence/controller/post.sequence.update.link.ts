import { NextFunction, Request, Response } from 'express';
import { sequenceRepository } from '../repository/r.sequence';
import { sequenceUploadRepository } from '../repository/r.sequence.upload';
import { randomUUID } from 'crypto';
import { g_DataSource } from '#/ready2start/database';
import { Sequence } from '../entity/e.sequence';
import { off } from 'process';

export const tags = ['Sequence'];
export const summary = 'create sequence link';
export const request = {
  path: '/sequence/update/link',
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
  const runner = g_DataSource.createQueryRunner();
  try {
    const now = new Date();
    const offset = 1000 * 60 * 60 * 9
    let linkId = randomUUID()
    const linkEndDate = new Date(now.setDate(now.getDate() + 3));
    const koreaTime = new Date(now.getTime() + offset);

    await runner.startTransaction();
    await runner.manager.update(Sequence, req.body.id, {
      linkId: linkId,
      linkEndDate: linkEndDate
    });
    await runner.commitTransaction();

    // console.log('https://sequence.humanb.kr/sequence/link/' + linkId)
    return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
            linkId: 'https://sequence.humanb.kr/sequence/link/' + linkId,
            linkEndDate: koreaTime.toISOString().replace("T", " ").split('.')[0],
            message: 'OK',
        },
    });
  } catch (err) {
    await runner.rollbackTransaction();
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
