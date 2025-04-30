import { NextFunction, Request, Response } from 'express';
import { CenterService } from '../../center/service/s.center';
import { ActivityLog } from '../../log/entity/e.activity.log';
import { activityLogRepository } from '../../log/repository/r.activity.log';

export const tags = ['Sequence'];
export const summary = 'Validate Autorization Before Playing Sequence';
export const request = {
  path: '/sequence/validation',
  method: 'get',
};

export const params = {
  path: {},
  query: {
    ipAddress: {},
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
    const ipAddress = String(req.query.ipAddress);

    const result = await CenterService.validateIpAddress(
      ipAddress,
      req['user'].center
    );
    const log = new ActivityLog();
    log.content = '시퀀스 재생';
    log.ip = ipAddress;
    log.who = req['user'].id;
    if (result) {
      await activityLogRepository.save(log);
      return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
          message: 'OK',
        },
      });
    }
    log.status = '비정상';
    await activityLogRepository.save(log);
    return res.json({
      version: process.env?.API_VERSION,
      message: 'UNAUTHORIZED_IP',
      code: 400,
      error: {
        code: 400,
        message: 'IP 주소가 다릅니다. 지정된 장소로 이동하여 사용해주세요',
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
