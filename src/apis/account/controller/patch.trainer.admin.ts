import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repository/r.account';
export const tags = ['Admin'];
export const summary = 'Edit Mypage';

export const request = {
  path: '/admin/trainer/{accountId}',
  method: 'patch',
};
export const params = {
  path: {
    accountId: {},
  },
  query: {
    isValid: {},
  },
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
    await accountRepository.update(req.params.accountId, {
      isValid: String(req.query.isValid) == 'false' ? 3 : 0,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'PATCH_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '업데이트 실패',
      },
    });
  }
  return res.json({
    version: process.env?.API_VERSION,
    message: 'OK',
    payload: {
      message: '업데이트 성공',
    },
  });
};

export default execute;
