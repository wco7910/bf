import { NextFunction, Request, Response } from 'express';
import { Sequence } from '../entity/e.sequence';
import { sequenceRepository } from '../repository/r.sequence';

export const tags = ['Sequence'];
export const summary = 'Edit Sequence';
export const request = {
  path: '/sequence/{sequenceId}',
  method: 'patch',
};

export const dto = 'patchSequence';

export const params = {
  path: {
    sequenceId: {
      type: 'string',
      description: '',
      example: 1,
    },
  },
  query: {},
  body: {
    name: {
      type: 'string',
      description: '시퀀스의 이름',
      example: '코어 시퀀스',
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
  // console.log('======> 바디 전체', req.body);
  // console.log(req.body.playList);
  try {
    // console.log(req.body.totalTime)
    // req.body.totalTime = Math.round(req.body.totalTime);
    // console.log(req.body.totalTime)
    const data: Sequence = req.body;
    data.currentOwner = req['user'];
    let count: number = 0;
    for (let i = 0; i < req.body.rounds.length; i++) {
      const round = req.body.rounds[i];
      if (round.type == '2') {
        count += parseInt(round.set.Repeat);
      }
    }
    data.creatorName = req['user'].username;
    data.rounds = req.body.rounds;
    data.roundCount = count;
    data.role = req['user'].role;
    data.centerName = req['user'].centerName;
    data.isCopied = 'F';
    data.isOriginal = 'T';
    if (req.body.playList == null || req.body.playList == undefined) {
      data.playList = null;
    }
    try {
      const result = await sequenceRepository.update(
        {
          id: req.params.sequenceId,
        },
        data
      );
      if (result.affected < 1) {
        throw Error;
      }
      return res.status(200).json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '시퀀스가 성공적으로 수정되었습니다.',
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        version: process.env?.API_VERSION,
        message: 'UPDATE_FAIL',
        code: 400,
        error: {
          code: 400,
          message: '시퀀스 수정에 실패했습니다.',
        },
      });
    }
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
