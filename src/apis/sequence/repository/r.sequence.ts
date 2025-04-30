import { g_DataSource } from '../../../ready2start/database';
import { Sequence } from '../entity/e.sequence';
import { sequenceUploadRepository } from './r.sequence.upload';

export const sequenceRepository = g_DataSource?.getRepository(Sequence).extend({
  adminList: async (pageNum, accountId, centerId, orderBy, sort) => {
    const query = sequenceRepository
      .createQueryBuilder('sequence')
      .leftJoin('sequence.uploadData', 'sequenceUpload')
      .leftJoin('sequence.currentOwner', 'account')
      .leftJoin('account.center', 'center');
    if (pageNum == null) {
      pageNum = 1;
    }
    if (accountId != null) {
      query.where('account.id =:accountId', { accountId: accountId });
    }
    if (centerId != null) {
      query.where('center.id =:centerId', { centerId: centerId });
    }
    if (orderBy == null) {
      if (centerId == null && accountId == null) {
        orderBy = 'sequence_intensity_no';
        query.where('sequence.isOriginal =:original', { original: 'T' });
      } else {
        orderBy = 'sequence_name';
      }
    }

    query
      .andWhere('sequence.isCopied =:condition', { condition: 'F' })
      .limit(10)
      .offset((pageNum - 1) * 10)
      .select('sequence.id', 'sequence_id')
      .addSelect('sequence.intensity', 'sequence_intensity')
      .addSelect('sequence.intensityNo', 'sequence_intensity_no')
      .addSelect('sequence.name', 'sequence_name')
      .addSelect('sequence.role', 'sequence_role')
      .addSelect('sequence.centerName', 'sequence_center')
      .addSelect('sequence.roundCount', 'sequence_round')
      .addSelect('sequence.restCount', 'sequence_rest')
      .addSelect('sequence.creatorName', 'creator_name')
      .addSelect('sequence.totalTime', 'total_time')
      .addSelect('sequence.createdAt', 'created_at')
      .addSelect('sequence.updatedAt', 'updated_at')
      .addSelect('sequence.isPublic', 'is_public')
      .addSelect('sequence.isOriginal', 'is_original')
      .addSelect('sequenceUpload.createdAt', 'uploaded_at');

    query.orderBy(`${orderBy}`, sort == 'DESC' ? 'DESC' : 'ASC');

    return [await query.getRawMany(), await query.getCount()];
  },
  getList: async (pageNum, sort, accountId) => {
    if (pageNum == null) {
      pageNum = 1;
    }
    return await sequenceRepository
      .createQueryBuilder('sequence')
      .leftJoin('sequence.currentOwner', 'currentOwner')
      .leftJoin('sequence.playList', 'playList')
      .select('sequence.id')
      .addSelect('sequence.name')
      .addSelect('sequence.isOriginal')
      .addSelect('sequence.roundCount')
      .addSelect('sequence.centerName')
      .addSelect('sequence.creatorName')
      .addSelect('sequence.totalTime')
      .addSelect('sequence.intensity')
      .addSelect('sequence.downloadCount')
      .addSelect('playList.title')
      .addSelect('sequence.createdAt')
      .addSelect('sequence.updatedAt')
      .addSelect('sequence.role')
      .andWhere('currentOwner.id =:id', { id: accountId })
      .orderBy('sequence.updatedAt', sort == 'ASC' ? 'ASC' : 'DESC')
      .take(10)
      .skip((pageNum - 1) * 10)
      .getManyAndCount();
  },
  getMyUploadList2: async (accountId, pageNum) => {
    if (pageNum == null) {
      pageNum = 1;
    }
    return await sequenceRepository
      .createQueryBuilder('sequence')
      .leftJoin('sequence.currentOwner', 'currentOwner')
      .leftJoin('sequence.playList', 'playList')
      .select('sequence.id')
      .addSelect('sequence.name')
      .addSelect('sequence.roundCount')
      .addSelect('sequence.creatorName')
      .addSelect('sequence.centerName')
      .addSelect('sequence.totalTime')
      .addSelect('sequence.intensity')
      .addSelect('sequence.downloadCount')
      .addSelect('playList.title')
      .addSelect('sequence.createdAt')
      .addSelect('sequence.updatedAt')
      .addSelect('sequence.role')
      .where('sequence.isPublic =:status', { status: 'T' })
      .andWhere('currentOwner.id =:id', { id: accountId })
      .orderBy('sequence.updatedAt', 'DESC')
      .take(10)
      .skip((pageNum - 1) * 10)
      .getManyAndCount();
  },
  getMyUploadList: async (accountId) => {
    const uploads = await sequenceUploadRepository
      .createQueryBuilder('sequenceUpload')
      .leftJoin('sequenceUpload.original', 'sequence')
      .leftJoin('sequence.currentOwner', 'currentOwner')
      .where('currentOwner.id =:id', { id: accountId })
      .orderBy('sequenceUpload.updatedAt', 'DESC')
      .getMany();
    const data = new Array(new Array());

    uploads.map((s) => {
      data[0].push(s.sequenceData);
    });

    return data;
  },
  getUploadList: async (centerId) => {
    return await sequenceRepository
      .createQueryBuilder('sequence')
      .leftJoin('sequence.currentOwner', 'currentOwner')
      .leftJoin('sequence.playList', 'playList')
      .leftJoin('currentOwner.center', 'center')
      .leftJoin('sequence.uploadData', 'data')
      //.select('sequence.id')
      .select('data.sequenceData', 'sequence')
      .addSelect('sequence.downloadCount', 'downloadCount')
      // .addSelect('sequence.creatorName')
      // .addSelect('sequence.totalTime')
      // .addSelect('sequence.intensity')
      // .addSelect('sequence.downloadCount')
      // .addSelect('playList.title')
      // .addSelect('sequence.role')
      //addSelect('sequence.createdAt')
      .where('sequence.isPublic =:status', { status: 'T' })
      .andWhere('center.id =:id', { id: centerId })
      .orderBy('sequence.updatedAt', 'DESC')
      .getRawMany();
  },
});
