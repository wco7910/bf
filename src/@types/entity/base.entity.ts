import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//SELECT TIMESTAMP '2020-08-06 12:00:00' AT TIME ZONE 'Australia/Melbourne';
export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    comment: '해당 Row가 생성된 시점',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    comment: '해당 데이터가 업데이트된 시점',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    comment: '해당 데이터가 soft-deleted된 시점',
  })
  deletedAt: Date;
}

/*
refrence:
entity == datbase 
createAt (X) -> crearte_at (0)
*/
