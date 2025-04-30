import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';

export const tags = ['Admin'];
export const summary = 'Delete account';
export const request = {
  path: '/app/account/{id}',
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
    const result = await AccountService.deletedAppAccount(req?.params?.id);
    // console.log(result)
    if(result.affected == 1) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: '회원 탈퇴에 성공했습니다.',
        },
      });
    } else {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'fail',
        payload: {
          message: '회원 탈퇴에 실패했습니다.',
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
