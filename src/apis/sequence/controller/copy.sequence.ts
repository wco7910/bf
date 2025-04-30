import { NextFunction, Request, Response } from 'express';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'upload sequence';
export const request = {
  path: '/sequence/copy/{sequenceId}',
  method: 'post',
};

export const params = {
  path: {
    sequenceId: {
      type: 'number',
      description: '',
      example: 1,
    },
  },
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
    const result = await SequenceService.copySequence(req.params.sequenceId);
    if (result) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '복사에 성공했습니다.',
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'COPY_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '복사에 실패했습니다.',
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
