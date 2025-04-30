import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Account'];
export const summary = 'Edit Mypage';

export const request = {
  path: '/account/mypage/{accountId}',
  method: 'patch',
};

export const dto = 'patchAccount';

export const params = {
  path: {
    accountId: {},
  },
  query: {},
  body: {
    centerNumber: {},
    name: {},
    carrier: {},
    phone: {},
    authNumber: {},
    photoKey: {},
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
    const result = await AccountService.patchAccount(
      req.body,
      req.params.accountId,
      req['user']
    );
    if (result == null) {
      throw Error();
    }
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        message: '업데이트 성공',
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'UPDATE_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '프로필 업데이트 실패',
      },
    });
  }
};

export default execute;
