import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid') // @Id + @GeneratedValue(strategy = IDENTITY)
  id: string;

  @CreateDateColumn({ name: 'created_at' }) // @CreatedDate
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // @LastModifiedDate
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' }) // @SoftDelete
  deletedAt: Date;
}
