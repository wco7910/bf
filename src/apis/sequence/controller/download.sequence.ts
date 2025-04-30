import { NextFunction, Request, Response } from 'express';
import { DownloadLogService } from '../../log/service/s.download.log';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'Create Sequence';
export const request = {
  path: '/sequence/download/{sequenceId}',
  method: 'post',
};

export const params = {
  path: {
    sequenceId: {
      type: 'string',
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
    const result = await SequenceService.download(
      req['user'],
      req.params.sequenceId
    );
    if (result) {
      const log = await DownloadLogService.saveDownloadLog(
        req['user'],
        req.params.sequenceId,
        'sequence'
      );
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          log,
          message: '다운로드에 성공했습니다.',
        },
      });
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'DOWNLOAD_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '다운로드에 실패했습니다.',
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
