import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { PhoneNumber } from '../../phone-numbers/entities/phone-number.entity';
import { SubCategory } from '../../sub-categories/entities/sub-category.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  order: number;

  @ManyToOne(() => SubCategory, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;

  @Column({ nullable: true, name: 'sub_category_id' })
  subCategoryId: string;

  @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.company, {
    cascade: true, // Şirketi kaydederken numaraları da içinde gönderebilirsin
    eager: true, // Şirketi çektiğinde numaralar da otomatik gelsin
  })
  phoneNumbers: PhoneNumber[];
}
