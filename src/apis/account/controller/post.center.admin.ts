import { NextFunction, Request, Response } from 'express';
import { AccountService } from '../service/s.account';
export const tags = ['Admin'];
export const summary = 'Create Center By Admin';

export const request = {
  path: '/admin/center',
  method: 'post',
};

export const dto = 'createCenter';

export const params = {
  path: {},
  query: {},
  body: {
    center_name: {},
    center_phone: {},
    center_password: {},
    center_ipAddress: {},
    center_comment: {},
    contract_autoPayment: {},
    contract_paymentMethod: {},
    contract_paymentAmount: {},
    contract_paidDate: {},
    contract_startDate: {},
    contract_endDate: {},
    account_name: {},
    account_phone: {},
    account_email: {},
    plan_id: {},
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
    const result = await AccountService.createCenterAdmin(req.body);

    if (result != true) {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'FAIL',
        code: 400,
        error: {
          code: 400,
          message: result,
        },
      });
    }
    else {
      return res.json({
        version: process.env?.API_VERSION,
        message: 'ok',
        payload: {
          message: 'ok',
        },
      });
    }

    // if (!result) {
    //   throw new Error('FAIL TO CREATE');
    // }
    // return res.json({
    //   version: process.env?.API_VERSION,
    //   message: 'ok',
    //   payload: {
    //     message: 'ok',
    //   },
    // });
  } catch (err) {
    return res.json({
      version: process.env?.API_VERSION,
      message: 'FAIL',
      code: 400,
      error: {
        code: 400,
        message: '계정을 생성하지 못했습니다.',
      },
    });
  }
};

export default execute;
