import { Module } from '@nestjs/common';
import { SupportReportsService } from './support-reports.service';
import { SupportReportsController } from './support-reports.controller';
import { SupportReport } from './entities/support-report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SupportReport])],
  controllers: [SupportReportsController],
  providers: [SupportReportsService],
})
export class SupportReportsModule {}
