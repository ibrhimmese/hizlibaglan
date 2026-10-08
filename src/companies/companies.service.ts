import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const newCompany = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(newCompany);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PageDto<Company>> {
    const { page, limit } = paginationQuery;

    const [data, count] = await this.companyRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { order: 'ASC' },
      relations: {
        subCategory: { category: true }, // İstediğin ilişkiler
        phoneNumbers: true,
      },
    });

    // Meta verisini hesapla
    const meta = new PageMetaDto(paginationQuery, data.length, count);

    // Generic DTO ile paketleyip gönder
    return new PageDto(data, meta);
  }

  async findByCategoryId(categoryId: string) {
    return await this.companyRepository.find({
      where: {
        subCategory: {
          category: {
            id: categoryId,
          },
        },
      },
      relations: {
        subCategory: true,
      },
    });
  }

  async searchByName(searchText: string): Promise<Company[]> {
    // 1. Güvenlik Kontrolü (DTO yakalamazsa diye serviste de kontrol)
    if (!searchText || searchText.trim().length < 3) {
      throw new BadRequestException('Arama metni en az 3 karakter olmalıdır.');
    }

    // 2. Metni Temizle ve Parçala
    // "  Garanti   Pendik  " -> ["Garanti", "Pendik"]
    const terms = searchText.trim().split(/\s+/);

    // 3. Query Builder Başlat
    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .where('company.isActive = :isActive', { isActive: true }); // Sadece aktifleri ara

    // 4. Algoritma: Her kelime ismin içinde geçmek ZORUNDA (AND mantığı)
    terms.forEach((term, index) => {
      const parameterName = `term_${index}`;

      // PostgreSQL için ILIKE (Büyük/Küçük harf duyarsız)
      queryBuilder.andWhere(`company.name ILIKE :${parameterName}`, {
        [parameterName]: `%${term}%`,
      });
    });

    // 5. Sonuçları Getir (Pagination YOK)
    // Limit koymak iyi pratiktir, veritabanını patlatmamak için max 20-50 kayıt dönülebilir.
    return await queryBuilder.limit(20).getMany();
  }

  async findOne(id: string) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      // Telefon numaralarını getir (JSON çıktında olduğu için ekliyorum)
      .leftJoinAndSelect('company.phoneNumbers', 'phoneNumbers')
      // Alt kategoriyi getir
      .leftJoinAndSelect('company.subCategory', 'subCategory')
      // Ana kategoriyi getir (Ama onun alt kategorilerini GETİRMEZ!)
      .leftJoinAndSelect('subCategory.category', 'category')
      // ID'ye göre filtrele
      .where('company.id = :id', { id })
      .getOne();

    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    return company;
  }

  async findBySubCategoryId(subCategoryId: string, isAdmin: boolean) {
    if (isAdmin) {
      return await this.companyRepository.find({
        where: { subCategoryId },
        order: { order: 'ASC' },
      });
    } else {
      return await this.companyRepository.find({
        where: { subCategoryId, isActive: true },
        order: { order: 'ASC' },
      });
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.preload({
      id,
      ...updateCompanyDto,
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    return await this.companyRepository.save(company);
  }

  async remove(id: string) {
    const companyToRemove = await this.companyRepository.findOne({
      where: { id },
    });

    if (!companyToRemove) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    await this.companyRepository.softRemove(companyToRemove);

    return { message: 'Company removed successfully' };
  }
}
