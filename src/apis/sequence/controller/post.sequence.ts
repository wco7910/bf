import { NextFunction, Request, Response } from 'express';
import { CreateSequenceDto } from '../dtos/create.sequence.dto';
import { sequenceRepository } from '../repository/r.sequence';

export const tags = ['Sequence'];
export const summary = 'Create Sequence';
export const request = {
  path: '/sequence',
  method: 'post',
};

export const dto = 'createSequence';

export const params = {
  path: {},
  query: {},
  body: {
    name: {
      type: 'string',
      description: '시퀀스의 이름',
      example: '코어 시퀀스',
    },
    goal: {
      type: 'string',
      description: '시퀀스의 목표',
      example: '목표',
    },
    memo: {
      type: 'string',
      description: '시퀀스의 메모',
      example: '메모',
    },
    manager: {
      type: 'string',
      description: '시퀀스의 담당자',
      example: '담당자',
    },
    totalTime: {
      type: 'string',
      description: '시퀀스의 총 시간',
      example: '370',
    },
    playList: {
      type: 'object',
      description: '플레이리스트 오브젝트',
      example: {
        id: '1',
      },
    },
    intensity: {
      type: 'string',
      description: '운동강도 low , normal, high',
      example: 'normal',
    },
    intensityNo: {
      example: 1,
    },
    rounds: {
      type: 'object',
      description: '라운드들',
      example: [
        {
          type: 'Warmup',
          title: 'WarmUp',
          totalTime: '60',
        },
        {
          type: '2',
          title: 'CCT 3',
          set: {
            Acts: 5,
            Go: '00:20',
            Repeat: 3,
            Rest: '00:30',
          },
          exercises: [],
        },
        {
          type: '1',
          title: 'RestBetwwenRounds',
          totalTime: '60',
        },
        {
          type: '2',
          title: 'CCT 3',
          set: {
            Acts: 5,
            Go: '00:20',
            Repeat: 3,
            Rest: '00:30',
          },
          exercises: [],
        },
      ],
    },
  },
  form: {},
};

export const security = ['ROLE'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = new CreateSequenceDto(req.body, req['user']);
    await sequenceRepository.save(dto);
    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
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
