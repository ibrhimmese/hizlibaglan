import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Company } from '../../companies/entities/company.entity';
import { RequestStatus } from '../../common/request-status-enum';

export enum SupportReportErrorType {
  SEQUENCE_NOT_WORKING = 'SEQUENCE_NOT_WORKING',
  NUMBER_NOT_WORKING = 'NUMBER_NOT_WORKING',
  OTHER = 'OTHER',
}

@Entity('support_reports')
export class SupportReport extends BaseEntity {
  @Column()
  errorType: SupportReportErrorType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: RequestStatus.PENDING })
  status: RequestStatus;

  @ManyToOne(() => Company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: string;
}
