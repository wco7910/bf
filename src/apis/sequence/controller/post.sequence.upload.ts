import { NextFunction, Request, Response } from 'express';
import { playListDownloadedRepository } from '../../play-list/repository/r.play.list.downloaded';
import { PlayListService } from '../../play-list/service/s.play.list';
import { sequenceRepository } from '../repository/r.sequence';
import { sequenceUploadRepository } from '../repository/r.sequence.upload';

export const tags = ['Sequence'];
export const summary = 'upload sequence';
export const request = {
  path: '/sequence/public/{sequenceId}',
  method: 'post',
};

export const params = {
  path: {
    sequenceId: {
      type: 'number',
      description: '',
      example: 1,
    },
  },
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
    const sequence = await sequenceRepository.findOne({
      where: {
        id: req.params.sequenceId,
      },
      relations: {
        playList: {
          musics: true,
        },
      },
    });
    sequence.currentOwner = null;
    const upload = sequenceUploadRepository.create();
    upload.sequenceData = sequence;
    upload.original = sequence;
    const result = await sequenceUploadRepository.upsert(upload, ['original']);
    await sequenceRepository.update(req.params.sequenceId, {
      isPublic: 'T',
    });
    return res.status(200).json({
      version: process.env?.API_VERSION,
      message: 'OK',
      payload: {
        name: req.body.name,
        role: req.body.role,
        center: req.body.centerName,
        message: '업로드에 성공하였습니다.',
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
