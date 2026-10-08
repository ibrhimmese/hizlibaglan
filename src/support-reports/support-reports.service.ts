import { Injectable } from '@nestjs/common';
import { CreateSupportReportDto } from './dto/create-support-report.dto';
import { UpdateSupportReportDto } from './dto/update-support-report.dto';
import { Repository } from 'typeorm';
import { SupportReport } from './entities/support-report.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupportReportsService {
  constructor(
    @InjectRepository(SupportReport)
    private supportReportRepository: Repository<SupportReport>,
  ) {}

  async create(createSupportReportDto: CreateSupportReportDto) {
    const supportReport = this.supportReportRepository.create(
      createSupportReportDto,
    );
    return await this.supportReportRepository.save(supportReport);
  }

  async findAll() {
    return await this.supportReportRepository.find();
  }

  async findOne(id: string) {
    const supportReport = await this.supportReportRepository.findOne({
      where: { id },
    });
    if (!supportReport) {
      throw new Error(`Support report with id ${id} not found`);
    }
    return supportReport;
  }

  async update(id: string, updateSupportReportDto: UpdateSupportReportDto) {
    await this.supportReportRepository.update(id, updateSupportReportDto);
    return await this.supportReportRepository.find({ where: { id } });
  }

  async remove(id: string) {
    const supportReport = await this.supportReportRepository.findOne({
      where: { id },
    });
    if (!supportReport) {
      throw new Error(`Support report with id ${id} not found`);
    }
    await this.supportReportRepository.softRemove(supportReport);
    return { message: `Support report removed successfully` };
  }
}
