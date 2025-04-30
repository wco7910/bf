import { g_DataSource } from '#/ready2start/database';
import { NextFunction, Request, Response } from 'express';
import { Account } from '../entity/e.account';
import { AccountService } from '../service/s.account';
import jwt from 'jsonwebtoken';

export const tags = ['Admin'];
export const summary = 'Edit Mypage';

export const request = {
  path: '/admin/password',
  method: 'patch',
};

export const dto = 'patchPassword';

export const params = {
  path: {},
  query: {
    token: {
      type: 'string',
      description: 'query로 날라온 JWT 토큰을 넘겨준다.',
    },
  },
  body: {
    passowrd: {
      type: 'string',
    },
  },
  form: {},
};

export const security = ['ANY'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    const result = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'INVALID TOKEN',
      code: 403,
      error: {
        code: 403,
        message: '잘못된 토큰입니다.',
      },
    });
  }
  const params = req.body;
  if (params.password != null) {
    params.password = await AccountService.encryptPassword(params.password);
  }
  const runner = g_DataSource.createQueryRunner();
  await runner.startTransaction();
  try {
    const result = await runner.manager.update(
      Account,
      {
        role: 'admin',
      },
      {
        password: params.password,
      }
    );
    if (result.affected != 1) throw Error();
    await runner.commitTransaction();
    return res.json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        message: '업데이트 성공',
      },
    });
  } catch (err) {
    console.log(err);
    await runner.rollbackTransaction();
    return res.json({
      version: process.env?.API_VERSION,
      message: 'UPDATE_FAIL',
      code: 400,
      error: {
        code: 400,
        message: '업데이트 실패',
      },
    });
  } finally {
    await runner.release();
  }
};

export default execute;
