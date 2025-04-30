import { g_DataSource } from '#/ready2start/database';
import { In } from 'typeorm';
import { centerRepository } from '../../center/repository/r.center';
import { exerciseRepository } from '../../exercise/repository/r.exercise';
import { fileRepository } from '../../file/repository/r.file';
import { PlayListDownloaded } from '../../play-list/entity/e.play.list.downloaded';
import { CopySequenceDto } from '../dtos/copy.sequence.dto';
import { CreateSequenceDto } from '../dtos/create.sequence.dto';
import { Sequence } from '../entity/e.sequence';
import { sequenceRepository } from '../repository/r.sequence';
import { sequenceUploadRepository } from '../repository/r.sequence.upload';

export const SequenceService = {
  adminList: async (pageNum, accountId, centerId, orderBy, sort) => {
    return await sequenceRepository.adminList(
      pageNum,
      accountId,
      centerId,
      orderBy,
      sort
    );
  },
  /**
   * @param pageNum 페이지 넘버
   * @param accountId 계정 고유 아이디
   * @returns
   */
  getAll: async (accountId) => {
    return await sequenceRepository.find({
      where: {
        currentOwner: {
          id: accountId,
        },
      },
      relations: {
        playList: true,
      },
    });
  },
  getList: async (pageNum, sort, accountId) => {
    if (pageNum == null) {
      pageNum = 1;
    }
    return await sequenceRepository.getList(pageNum, sort, accountId);
  },
  /**
   *
   * @param sequenceId 보고자하는 시퀀스의 아이디
   * @returns
   */
  get: async (sequenceId) => {
    const sequence = await sequenceRepository.findOne({
      where: {
        id: sequenceId,
      },
      relations: {
        playList: {
          musics: true,
        },
      },
    });

    return await SequenceService.sequenceUpToDate(sequence);
  },
  
  getSequenceLink: async (sequenceId) => {
    const sequence = await sequenceRepository.findOne({
      where: {
        linkId: sequenceId,
      }
      // ,
      // relations: {
      //   playList: {
      //     musics: true,
      //   },
      // },
    });

    console.log('id : ' + sequence.id)
    console.log('linkid : ' + sequence.linkId)
    if(sequence.linkEndDate < new Date()) {
      return '만료';
    } else {
      return sequence;
      // return await SequenceService.sequenceUpToDate(sequence);
    }
  },

  sequenceUpToDate: async (_sequence) => {

    const sequence = _sequence;
    const rounds = sequence.rounds;
    const ids = new Array();
    const deleted = new Array();
    for (const round of rounds) {
      if (round['type'] == '2') {
        for (const exercise of round['exercise']) {
          if (exercise.type != 'exercise') {
            continue;
          }
          if (exercise.name == 'Search exercise...') continue;
          const id = exercise.id;
          ids.push(id);
        }
      }
    }

    const files = await fileRepository.find({
      where: {
        serviceId: In(ids),
        service: 'exerciseVideo',
        isUsed: 'T',
      },
    });

    const exercise = await exerciseRepository.find({
      where: {
        id: In(ids),
      },
    });
    const fileMap = new Map();
    for (const file of files) {
      fileMap.set(file.serviceId, file);
    }
    const exerciseMap = new Map();
    for (const ex of exercise) {
      exerciseMap.set(ex.id, ex);
    }
    // console.log('get sequence data')
    for (const round of sequence.rounds) {
      if (round['type'] == '2') {
        for (const exercise of round['exercise']) {
          if(exercise?.isMade == true) {
            // console.log('isMade : true')
            // console.log(exercise)
            // console.log('-----')
          }
          if (exercise?.type != 'exercise' || exercise?.isMade == true) {
            continue;
          }
          const file = fileMap.get(exercise.id);
          if (file == undefined) {
            if (exercise.name == 'Search exercise...') continue;
            if (exerciseMap.get(exercise.id) != undefined) {
              exercise.isExist = true;
              // console.log('isExist : true')
              continue;
            }

            if (exercise.id) deleted.push(exercise.engName);
            if (exercise.isMade == true) continue;
            exercise.uri = null;
            exercise.poster = null;
            exercise.isExist = false;

            // console.log('isExist : false')
            continue;
          }
          exercise.uri =
            process?.env?.CDN_URL +
            '/' +
            file.path +
            '/' +
            file.id +
            '.' +
            file.ext;
          delete exercise.isExist;
        }
      }
    }
    const seq = await sequenceRepository.update(sequence.id, {
      rounds: sequence.rounds,
      updatedAt: sequence.updatedAt,
    });

    return { sequence: sequence, deletedExercise: deleted };
  },
  /**
   * 센터별 업로드된 시퀀스의 카운트를 보여주는 식
   */
  getUploadCount: async () => {
    return await centerRepository.getUploadSequenceCount();
  },
  getUploadList: async (centerId) => {
    return await sequenceRepository.getUploadList(centerId);
  },
  /**내가 업로드한 시퀀스들을 볼 때 사용 */
  getMyUploadList: async (accountId) => {
    return await sequenceRepository.getMyUploadList(accountId);
  },
  /**
   * 시퀀스를 복사하기 위한 메서드
   * @param sequenceId 복사하고자하는 시퀀스의 ID
   * @returns 성공 여부를 Boolean 타입으로 전달
   */
  copySequence: async (sequenceId) => {
    try {
      const sequence: Sequence = await sequenceRepository.findOne({
        where: {
          id: sequenceId,
        },
        relations: {
          currentOwner: true,
          playList: true,
        },
      });
      const _sequence = new CopySequenceDto(sequence);
      const input = sequenceRepository.create(_sequence);
      await sequenceRepository.save(input);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  /**
   * 공유된 시퀀스를 다운로드 받기 위한 메서드
   * @param account 로그인한 사용자의 정보
   * @param sequenceId 시퀀스 아이디
   * @returns
   */
  download: async (account, sequenceId) => {
    const runner = g_DataSource.createQueryRunner();
    await runner.startTransaction();
    try {
      const sequenceData = await sequenceUploadRepository.findOne({
        where: {
          original: {
            id: sequenceId,
          },
        },
      });
      await runner.manager.update(Sequence, sequenceId, {
        downloadCount: () => 'download_count + 1',
      });
      const result: Sequence = sequenceData.sequenceData;
      const playList = result.playList;
      if (playList != null) {
        const playListDownloaded = new PlayListDownloaded();
        playListDownloaded.account = account;
        playListDownloaded.centerName = result.centerName;
        playListDownloaded.playListData = JSON.stringify(playList);
        await runner.manager.save(playListDownloaded);
      }
      result.playList = null;
      const sequence = new CreateSequenceDto(result, account);
      sequence.creatorName = result.creatorName;
      sequence.centerName = result.centerName;
      sequence.role = result.role;
      sequence.isOriginal = 'F';
      sequence.updatedAt = new Date();
      const _sequence = sequenceRepository.create(sequence);

      await runner.manager.save(_sequence);
      await runner.commitTransaction();
      return true;
    } catch (err) {
      console.log(err);
      await runner.rollbackTransaction();
      return false;
    } finally {
      await runner.release();
    }
  },
  delete: async (accountId, sequenceId) => {
    const target = await sequenceRepository.findOne({
      where: {
        id: sequenceId,
        currentOwner: {
          id: accountId,
        },
      },
      relations: {
        lectureToSubs: true,
        uploadData: true,
      },
    });
    return await sequenceRepository.softRemove(target);
  },
  deleteAdmin: async (sequenceId) => {
    const target = await sequenceRepository.findOne({
      where: {
        id: sequenceId,
      },
      relations: {
        lectureToSubs: true,
        uploadData: true,
      },
    });
    return await sequenceRepository.softRemove(target);
  },
};
