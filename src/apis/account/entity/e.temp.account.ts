import { Base } from '#/@types/entity/base.entity';
import { Column, Entity } from 'typeorm';
@Entity()
export class TempAccount extends Base {
  @Column({
    comment: '로그인에 사용할 이메일 ',
  })
  email: string;

  @Column({
    comment: '회원 or 관리자의 이름',
  })
  name: string;

  @Column({
    comment: '회원사의 통신사 정보',
  })
  carrier: string;

  @Column({
    comment: '회원의 핸드폰 번호',
  })
  phone: string;

  @Column({
    comment: 'Admin, Center, Trainer로 나뉘는 권한',
  })
  role: string;

  @Column('simple-json', {
    comment: '따로 지정하 불명확한 정보들을 위한 컬럼',
    nullable: true,
  })
  etc: string;
}
