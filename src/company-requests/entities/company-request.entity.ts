import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { RequestStatus } from '../../common/request-status-enum';

@Entity('company_requests')
export class CompanyRequest extends BaseEntity {
  @Column()
  name: string;

  @Column()
  categoryName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  number: string;

  @Column({ nullable: true })
  numberSequence: string;

  @Column({ default: RequestStatus.PENDING })
  requestStatus: RequestStatus;
}
