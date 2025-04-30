import { NextFunction, Request, Response } from 'express';
import { sequenceRepository } from '../repository/r.sequence';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Admin'];
export const summary = 'Delete Sequence Admin';
export const request = {
  path: '/admin/sequence/{sequenceId}',
  method: 'delete',
};

export const params = {
  path: {
    sequenceId: {
      type: 'number',
      description: '',
      example: '',
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
    const result = await SequenceService.deleteAdmin(req.params.sequenceId);

    if (result == null) {
      throw new Error('해당 하는 시퀀스가 없습니다.');
    }
    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        message: '삭제에 성공하였습니다.',
      },
    });
  } catch (err) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'DELETE_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '삭제에 실패하였습니다.',
        err,
      },
    });
  }
};
export default execute;
