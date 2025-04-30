import { Base } from '#/@types/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AccountPhoneAuthLog extends Base {
  @Column({
    comment: '핸드폰 인증을 위한 번호',
  })
  phone: string;

  @Column({
    comment: '인증 번호',
  })
  authNumber: string;

  @Column({
    default: 'N',
    comment: '해당 인증의 성공 여부를 저장하는 컬럼',
  })
  isSuccess: string;

  @Column({
    default: 'N',
    comment:
      '해당 인증이 사용 가능한지를 저장하는 컬럼 ex) 생성 시 N, 인증 시 Y, 사용 후 N. 혹시 모를 중복 사용을 방지하기 위해 이러한 컬럼이 필요',
  })
  enable: string;

  @Column({
    comment: '어떤 일을 위해 사용한것인지 나타내는 컬럼',
  })
  purpose: string;

  @Column({
    comment: '만료된 인증번호를 프론트에서 걸러내지 못했을때를 위한 필터',
  })
  expiredAt: Date;
}
