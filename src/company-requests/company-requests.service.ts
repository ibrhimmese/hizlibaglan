import { Injectable } from '@nestjs/common';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyRequestDto } from './dto/update-company-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRequest } from './entities/company-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyRequestsService {
  constructor(
    @InjectRepository(CompanyRequest)
    private companyRequestRepository: Repository<CompanyRequest>,
  ) {}

  async create(createCompanyRequestDto: CreateCompanyRequestDto) {
    const companyRequest = this.companyRequestRepository.create(
      createCompanyRequestDto,
    );
    return await this.companyRequestRepository.save(companyRequest);
  }

  async findAll() {
    return await this.companyRequestRepository.find();
  }

  async findOne(id: string) {
    const companyRequest = await this.companyRequestRepository.findOne({
      where: { id },
    });
    if (!companyRequest) {
      throw new Error(`Company request with id ${id} not found`);
    }
    return companyRequest;
  }

  async update(id: string, updateCompanyRequestDto: UpdateCompanyRequestDto) {
    await this.companyRequestRepository.update(id, updateCompanyRequestDto);
    return await this.companyRequestRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const companyRequest = await this.companyRequestRepository.findOne({
      where: { id },
    });
    if (!companyRequest) {
      throw new Error(`Company request with id ${id} not found`);
    }
    await this.companyRequestRepository.softRemove(companyRequest);
    return { message: `Company request removed successfully` };
  }
}
