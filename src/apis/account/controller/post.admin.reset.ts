import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repository/r.account';
import { MailService } from '../service/s.email';
import jwt from 'jsonwebtoken';
export const tags = ['Admin'];
export const summary = 'Send Password Reset Email';

export const request = {
  path: '/admin/reset',
  method: 'post',
};

export const dto = 'adminEmail';

export const params = {
  path: {},
  query: {},
  body: {
    email: {
      type: 'string',
      description: '',
      example: '정한겸',
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
    const email = req.body?.email;
    if (email == null || email == undefined) {
      throw Error();
    }
    const account = await accountRepository.findOne({
      where: {
        email: email,
        role: 'admin',
      },
    });
    console.log(account);
    if (account == null) {
      throw Error();
    }
    try {
      const access_token: string = await jwt.sign(
        {
          role: account.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '10m',
          // expiresIn: '12h',
        }
      );
      const info = await MailService.sendMail(email, access_token);
      console.log(info);
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          token: access_token,
          message: 'OK.',
        },
      });
    } catch (err) {
      console.log(err);
      throw Error();
    }
  } catch (err) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'NOT_FOUND',
      code: 400,
      error: {
        code: 400,
        message: '계정을 찾지 못했습니다.',
      },
    });
  }
};

export default execute;
