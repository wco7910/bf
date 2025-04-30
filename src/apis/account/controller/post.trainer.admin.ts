import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Admin'];
export const summary = 'Add Trainer By Admin';

export const request = {
  path: '/admin/trainer',
  method: 'post',
};

export const dto = 'createTrainer';

export const params = {
  path: {},
  query: {},
  body: {
    email: {},
    password: {},
    center_code: {},
    name: {},
    carrier: {},
    phone: {},
    file_id: {},
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
    const params = req.body;
    const result = await AccountService.createTrainerAdmin(params);
    if (!result) {
      throw new Error('FAIL TO CREATE');
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'ok',
      payload: {
        message: 'ok',
      },
    });
  } catch (err) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'FAIL',
      code: 400,
      error: {
        code: 400,
        message: '가입에 실패했습니다..',
      },
    });
  }
};

export default execute;
