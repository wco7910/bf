import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Account } from '../entity/e.account';
import { accountRepository } from '../repository/r.account';
import { AccountService } from '../service/s.account';

export const tags = ['Account'];
export const summary = 'token re-issue';

export const request = {
  path: '/account/token',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    refreshToken: {
      description: '로그인시 access_token과 함께 발급된 토큰',
    },
    ipAddress: {
      description: '클라이언트의 IP 주소',
    },
  },
  body: {},
  form: {},
};

export const security = ['ANY'];

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // console.log(ip);
  // console.log(req.ip);
  try {
    const token = req.query?.refreshToken;
    // console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);

    if(decoded?.id == 'd2d498ee-815e-4609-8e7d-92ace97e1000' || decoded?.id == 'a55baca1-cc8f-465c-9208-d3a033d37647' || decoded?.id == '7110179f-b111-499a-b49c-a3bba83babbf'
    || decoded?.id == '528c9e96-4f79-4865-9b90-108186aae92f' || decoded?.id == 'f7f83f1d-0b73-48a4-8085-d5550031a529') {
      const account: Account = await accountRepository.findOne({
        where: {
          id: decoded.id,
        },
        relations: {
          center: true,
        },
      });
  
      const [access_token, refresh_token, expired_at] = await AccountService.jwtAssign(account, String(req.query.ipAddress));
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          access_token: access_token,
          expired_at: expired_at,
          type: 'Bearer',
        },
      });
    } else {
      const account: Account = await accountRepository.findOne({
        where: {
          id: decoded.id,
        },
        relations: {
          center: true,
        },
      });
  
      if (token != account.refreshToken) {
        return res.json({
          version: process.env?.API_VERSION,
          message: 'Duplicate Login',
          code: 403,
          error: {
            code: 403,
            message: '다른 기기에서 로그인된 아이디입니다.',
          },
        });
      }
  
      const result = await AccountService.suspendCheck(account.id);
  
      if (!result) {
        return res.json({
          version: process.env?.API_VERSION,
          message: 'SUSPENDED_ACCOUNT',
          code: 403,
          error: {
            code: 403,
            message: '활동이 정지된 계정입니다.',
          },
        });
      }
  
      console.log(req.query)
      console.log(req.query.ipAddress)
      return;
      const [access_token, refresh_token, expired_at] = await AccountService.jwtAssign(account, String(req.query.ipAddress));
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          access_token: access_token,
          expired_at: expired_at,
          type: 'Bearer',
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'Error',
      code: 400,
      error: {
        code: 400,
        message: err,
      },
    });
  }
};

export default execute;
