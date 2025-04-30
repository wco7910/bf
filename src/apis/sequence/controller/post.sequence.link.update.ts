import { NextFunction, Request, Response } from 'express';
import { sequenceRepository } from '../repository/r.sequence';
import { randomUUID } from 'crypto';
import { prescriptionRepository } from '../../prescription/repository/r.prescription';
import { CreatePrescriptionDto } from '../../prescription/dtos/create.prescription.dto';

export const tags = ['Sequence'];
export const summary = 'create sequence link';
export const request = {
  path: '/sequence/link/update',
  method: 'post',
};

export const params = {
  path: {},
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
    const now = new Date();
    const offset = 1000 * 60 * 60 * 9
    let linkId = randomUUID()
    const linkEndDate = new Date(now.setDate(now.getDate() + 5));
    const koreaTime = new Date(now.getTime() + offset);
    // console.log(linkId)
    await sequenceRepository.update(req.body.id, {
      linkId: linkId,
      linkEndDate: linkEndDate
    });

    const body = {
      userName: 'name',
      phone: '010',
      type: '시퀀스',
      linkId: linkId,
      linkStartDate: new Date(),
      linkEndDate: linkEndDate,
      completedCount: 0
    }

    const dto = new CreatePrescriptionDto(body, req.user);
    await prescriptionRepository.insert(dto);

    // console.log('https://sequence.humanb.kr/sequence/link/' + linkId)
    return res.json({
        version: process.env?.API_VERSION,
        message: 'OK',
        payload: {
            linkId: 'https://sequence.humanb.kr/sequence/link/' + linkId,
            linkEndDate: koreaTime.toISOString().replace("T", " ").split('.')[0],
            message: 'OK',
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
