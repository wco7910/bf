import { Base } from '#/@types/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  Relation,
  RelationId,
  ManyToOne,
} from 'typeorm';
import { Sequence } from './e.sequence';

@Entity()
export class SequenceUpload extends Base {
  @Column({
    type: 'simple-json',
    comment:
      'Join들을 통해 받아온 원본의 모든 데이터들을 가공을 거친 후 JSON형식으로 저장. 해당 데이터를 저장할 때 이 JSON 데이터를 가져와 새로운 컬럼을 생성',
  })
  sequenceData: Relation<Sequence>;

  @OneToOne(() => Sequence, (sequence) => sequence.uploadData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  original: Relation<Sequence>;

  // @RelationId((sequenceUpload: SequenceUpload) => sequenceUpload.original)
  // originalId: number;

  @Column({
    comment: 'sequence_upload originalId',
  })
  originalId: string;

}
