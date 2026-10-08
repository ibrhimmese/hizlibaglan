import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string; // Hashlenmiş (şifrelenmiş) tutulacak

  @Column({ default: 'admin' }) // Senin senaryonda sadece admin var
  role: string;
}
