import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('phone_numbers')
export class PhoneNumber extends BaseEntity {
  @Column()
  title: string; // Örn: "Müşteri Hizmetleri"

  @Column()
  number: string; // Örn: "444 0 333"

  @Column({ nullable: true })
  sequence: string; // Örn: "1,,3,,5" (Virgüller bekleme süresi)

  @Column()
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  workedCount: number; // Bu numaraya tıklanma sayısı (İstatistik için)

  @Column({ default: 0 })
  notWorkedCount: number; // Bu numaraya tıklanıp çalışmama sayısı (İstatistik için)

  @Column({ nullable: true })
  lastUsedAt: Date; // Son kullanım zamanı (İstatistik için)

  // İlişki: Bir numara bir şirkete aittir
  @ManyToOne(() => Company, (company) => company.phoneNumbers, {
    onDelete: 'CASCADE', // Şirket silinirse numaraları da silinsin (Öksüz veri kalmasın)
    lazy: true, // İlişkili şirket verisi gerektiğinde çekilsin
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: string; // İlişkiyi ID üzerinden yönetmek için pratik bir sütun
}
