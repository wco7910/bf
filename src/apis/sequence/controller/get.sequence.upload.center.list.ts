import { NextFunction, Request, Response } from 'express';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'Search Sequence';
export const request = {
  path: '/sequence/upload/center/{centerId}',
  method: 'get',
};

export const params = {
  path: {
    centerId: {
      type: 'number',
      description: '',
      example: '1',
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
    const results = await SequenceService.getUploadList(req.params.centerId);
    for (const result of results) {
      result['sequence'] = JSON.parse(result['sequence']);
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        results,
        message: 'OK',
      },
    });
  } catch (error) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Invalid Request',
      code: 400,
      payload: {
        message: 'Invalid Request',
        code: 400,
      },
    });
  }
};
export default execute;
