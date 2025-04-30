import { Base } from '#/@types/entity/base.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
  UpdateDateColumn
} from 'typeorm';
import { Account } from '../../account/entity/e.account';
import { LectureToSub } from '../../lecture/entity/e.lectureToSub';
import { PlayList } from '../../play-list/entity/e.play.list';
import { SequenceUpload } from './e.sequence.upload';

@Entity()
export class Sequence extends Base {
  @Column({
    comment: '시퀀스의 이름',
  })
  name: string;

  @ManyToOne(() => Account, (account) => account.sequences)
  currentOwner: Relation<Account>;

  @Column({
    comment: '해당 시퀀스의 강도',
  })
  intensity: string;

  @Column({
    comment: '해당 시퀀스의 강도를 숫자로 표현한것 0,1,2',
  })
  intensityNo: number;

  @Column({
    comment: '생성자의 이름',
  })
  creatorName: string;

  @Column({
    comment: '생성자의 롤',
  })
  role: string;

  @Column({
    comment: '생성자의 센터명',
  })
  centerName: string;

  // @OneToMany(() => Round, (round) => round.sequence)
  // rounds: Relation<Round>[];

  @Column({
    type: 'simple-json',
    nullable: true,
    comment: '시퀀스에 속하는 라운드, JSON형태로 저장',
  })
  rounds: string;

  @Column({
    default: 'F',
    comment: '업로드 여부',
  })
  isPublic: string;

  @OneToOne(() => SequenceUpload, (sequenceUpload) => sequenceUpload.original, {
    cascade: ['soft-remove'],
  })
  uploadData: Relation<SequenceUpload>;

  @Column({
    comment: '시퀀스의 총 시간',
  })
  totalTime: number;

  @Column({
    default: 0,
    comment: '총 라운드 카운트',
  })
  roundCount: number;

  @Column({
    default: 0,
    comment: '총 레스트 카운트',
  })
  restCount: number;

  @Column({
    default: 'T',
    comment: '시퀀스의 오리지널 여부 판단',
  })
  isOriginal: string;

  @Column({
    default: 'F',
    comment: '시퀀스의 복사 여부 판단',
  })
  isCopied: string;

  @ManyToOne(() => PlayList, (playList) => playList.sequences, {
    onDelete: 'SET NULL',
  })
  playList: Relation<PlayList>;

  @Column({
    default: 0,
    name: 'download_count',
  })
  downloadCount: number;

  @Column({
    comment: '시퀀스의 목표',
  })
  goal: string;

  @Column({
    comment: '시퀀스의 메모',
  })
  memo: string;

  @Column({
    comment: 'linkId',
  })
  linkId: string;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    comment: 'linkEndDate',
  })
  linkEndDate: Date;

  @Column({
    comment: 'sequence currentOwnerId',
  })
  currentOwnerId: string;

  @OneToMany(() => LectureToSub, (lectureToSub) => lectureToSub.sequence, {
    cascade: ['soft-remove'],
  })
  lectureToSubs: Relation<LectureToSub>[];

  @Column({
    comment: '시퀀스의 담당자',
  })
  manager: string;

    // @OneToMany(() => SequenceUpload, (sequenceupload) => sequenceupload.sequence)
  // sequenceuploads: Relation<SequenceUpload>[];
}
