import { Module } from '@nestjs/common';
import { CompanyRequestsService } from './company-requests.service';
import { CompanyRequestsController } from './company-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRequest } from './entities/company-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRequest])],
  controllers: [CompanyRequestsController],
  providers: [CompanyRequestsService],
})
export class CompanyRequestsModule {}
