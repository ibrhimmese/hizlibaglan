import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('sub_categories')
export class SubCategory extends BaseEntity {
  @Column()
  name: string;

  @Column()
  order: number; // Alt kategorilerin sıralaması için

  // --- İLİŞKİ 1: Üst Kategoriye Bağlanma ---
  @ManyToOne(() => Category, {
    onDelete: 'CASCADE', // Ana kategori silinirse altları da silinsin
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: false })
  categoryId: string; // İlişki ID'sini direkt tutmak için
}
