import { NextFunction, Request, Response } from 'express';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'my sequence upload list';
export const request = {
  path: '/sequence/my/upload',
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
    const result = await SequenceService.getMyUploadList(req['user'].id);

    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        myUploadList: result,
        message: '시퀀스 업로드 리스트를 불러오는데 성공했습니다.',
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
