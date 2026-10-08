import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { RequestStatus } from '../../common/request-status-enum';

@Entity('contacts')
export class Contact extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  topic: string;

  @Column()
  message: string;

  @Column({ default: RequestStatus.PENDING })
  status: RequestStatus;
}
