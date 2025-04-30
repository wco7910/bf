import { Account } from '../entity/e.account';
import { g_DataSource } from '../../../ready2start/database';

export const accountRepository = g_DataSource?.getRepository(Account).extend({
  async getCenterTrainer(centerId) {
    return await accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.center', 'center')
      .select('account.id', 'account_id')
      .addSelect('account.name', 'account_name')
      .addSelect('account.email', 'account_email')
      .addSelect('center.name', 'center_name')
      .addSelect('account.createdAt', 'created_at')
      .addSelect('account.isValid', 'is_valid')
      .addSelect(
        (s) =>
          s
            .select('COUNT(tempo)')
            .from('tempo', 'tempo')
            .where('tempo.currentOwner = account.id'),
        'tempo_count'
      )
      .addSelect(
        (s) =>
          s
            .select('COUNT(sequence)')
            .from('sequence', 'sequence')
            .where('sequence.currentOwner = account.id'),
        'sequence_count'
      )
      .addSelect(
        (s) =>
          s
            .select('COUNT(lecture)')
            .from('lecture', 'lecture')
            .where('lecture.currentOwner = account.id'),
        'lecture_count'
      )
      .addSelect((s) =>
        s
          .select('file.id', 'photo_key')
          .from('file', 'file')
          .where('file.serviceId = account.id::TEXT')
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .addSelect((s) =>
        s
          .select('file.path', 'photo_path')
          .from('file', 'file')
          .where('file.serviceId = account.id::TEXT')
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .addSelect((s) =>
        s
          .select('file.ext', 'photo_ext')
          .from('file', 'file')
          .where('file.serviceId = account.id::TEXT')
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .where('center.id =:centerId', { centerId: centerId })
      .andWhere('account.role =:role', { role: 'trainer' })
      .getRawMany();
  },
  async getTrainerList(pageNum, orderBy, sort, searchText) {
    const query = accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.center', 'center')
      .select('account.id', 'account_id')
      .addSelect('account.name', 'account_name')
      .addSelect('account.email', 'account_email')
      .addSelect('center.name', 'center_name')
      .addSelect('account.createdAt', 'created_at')
      .addSelect('account.isValid', 'is_valid')
      .addSelect('account.phone', 'account_phone')
      .addSelect(
        (s) =>
          s
            .select('COUNT(tempo)')
            .from('tempo', 'tempo')
            .where('tempo.currentOwner = account.id'),
        'tempo_count'
      )
      .addSelect(
        (s) =>
          s
            .select('COUNT(sequence)')
            .from('sequence', 'sequence')
            .where('sequence.currentOwner = account.id'),
        'sequence_count'
      )
      .addSelect(
        (s) =>
          s
            .select('COUNT(lecture)')
            .from('lecture', 'lecture')
            .where('lecture.currentOwner = account.id'),
        'lecture_count'
      )
      .addSelect((s) =>
        s
          .select('file.id', 'photo_key')
          .from('file', 'file')
          .where('file.serviceId = account.id::TEXT')
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .addSelect((s) =>
        s
          .select('file.path', 'photo_path')
          .from('file', 'file')
          .where('file.serviceId = account.id::TEXT')
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .addSelect((s) =>
        s
          .select('file.ext', 'photo_ext')
          .from('file', 'file')
          .where('file.serviceId = account.id::TEXT')
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .where('account.role =:role', { role: 'trainer' });
    // if (conditions?.centerId != null) {
    //   query.andWhere('account.centerId =:centerId', {
    //     centerId: conditions.centerId,
    //   });
    // }
    // if (accountName != null && accountName != '' && accountName != undefined) {
    //   query.andWhere('account.name ILIKE :accountName', {
    //     accountName: `%${accountName}%`,
    //   });
    // }

    if (searchText != null && searchText != '' && searchText != undefined) {
      query.where('center.name ILIKE :searchText OR account.email ILIKE :searchText OR account.name ILIKE :searchText OR account.phone ILIKE :searchText', {
        searchText: `%${searchText}%`,
      })
    }

    return {
      trainerList: await query
        .limit(10)
        .offset((pageNum - 1) * 10)
        .orderBy(`${orderBy}`, sort == 'desc' ? 'DESC' : 'ASC')
        .getRawMany(),
      totalTrainer: await query.getCount(),
    };
  },
  async getMyPage(id) {
    return await accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.email', 'email')
      .addSelect('account.name', 'name')
      .addSelect('account.role', 'role')
      .addSelect('account.phone', 'phone')
      .addSelect('account.carrier', 'carrier')
      .addSelect('center.id', 'centerId')
      .addSelect('center.name', 'centerName')
      .addSelect('center.phone', 'centerPhone')
      .addSelect('center.ipAddress', 'centerIP')
      .addSelect('center.identifyCode', 'centerIdentifyCode')
      .addSelect((s) =>
        s
          .select('file.id', 'photoKey')
          .from('file', 'file')
          .where('file.serviceId =:id', { id: id })
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .addSelect((s) =>
        s
          .select('file.path', 'photoPath')
          .from('file', 'file')
          .where('file.serviceId =:id', { id: id })
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .addSelect((s) =>
        s
          .select('file.ext', 'photoExt')
          .from('file', 'file')
          .where('file.serviceId =:id', { id: id })
          .andWhere('file.service =:service', { service: 'profile' })
          .andWhere('file.isUsed =:status', { status: 'T' })
          .limit(1)
      )
      .leftJoin('account.center', 'center')
      .where('account.id =:id', { id: id })
      .getRawOne();
  },
});
