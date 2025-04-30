import { NextFunction, Request, Response } from 'express';
import { CenterService } from '../../center/service/s.center';

export const tags = ['Admin'];
export const summary = 'Delete Trainer';
export const request = {
  path: '/admin/trainer/{trainerId}',
  method: 'delete',
};

export const params = {
  path: {
    trainerId: {
      description: '트레이너의 ID, UUID로 구성되어있다.',
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
    const result = await CenterService.adminDeleteTrainer(req.params.trainerId);

    if (result) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '트레이너 삭제에 성공했습니다.',
        },
      });
    }
    return res.status(400).json({
      version: process.env?.API_VERSION,
      message: 'DELETE_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '트레이너 삭제에 실패했습니다.',
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
