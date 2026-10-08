import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { SubCategory } from '../../sub-categories/entities/sub-category.entity';

@Entity('categories') // Tablo adı
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string; // Frontend ikon adı (örn: "landmark")

  @Column()
  order: number; // Kategorilerin sıralaması için

  @Column({ nullable: true })
  color: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category, {
    eager: false,
  })
  subCategories: SubCategory[];
}
