import { NextFunction, Request, Response } from 'express';
import { Sequence } from '../entity/e.sequence';
import { SequenceService } from '../service/s.sequence';

export const tags = ['Sequence'];
export const summary = 'Search Sequence';
export const request = {
  path: '/sequence/{sequenceId}',
  method: 'get',
};

export const params = {
  path: {
    sequenceId: {
      type: 'string',
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
    const sequence = await SequenceService.get(req.params.sequenceId);
    // console.log('-----------------')
    // console.log(sequence)
    // console.log('-----------------')
    // console.log(sequence.sequence.rounds)
    // console.log('-----------------')
    // console.log(sequence.sequence.rounds[1].exercise)
    // console.log('-----------------')
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        sequence: sequence.sequence,
        deletedExercises: sequence.deletedExercise,
        message: 'OK',
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'LOAD_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '시퀀스를 불러오는데 실패했습니다.',
      },
    });
  }
};
export default execute;
