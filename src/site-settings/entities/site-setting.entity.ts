import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity('site_settings')
export class SiteSetting extends BaseEntity {
  @Column()
  key: string;

  @Column({ type: 'varchar' })
  value: string;
}
