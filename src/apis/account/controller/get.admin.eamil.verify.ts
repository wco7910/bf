import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
export const tags = ['Admin'];
export const summary = 'Edit Mypage';

export const request = {
  path: '/admin/password',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    resetToken: {},
    email: {},
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
  try {
    const token = req.query.resetToken;
    const result = jwt.verify(token, process.env?.JWT_SECRET_KEY);
    if (result?.role != 'admin') {
      throw new Error('not authorized');
    }
    return res.redirect(
      process.env?.ADMIN_URL +
        `/password/change?id=${req.query.email}&token=` +
        token
    );
  } catch (err) {
    console.log(err);
    return res.send(
      "<script>alert('Expired Link!')</script>" +
        `<script>window.location="${process.env?.ADMIN_URL}"</script>`
    );
  }
};

export default execute;
