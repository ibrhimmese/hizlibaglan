import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SupportReportErrorType } from '../entities/support-report.entity';

export class CreateSupportReportDto {
  @IsEnum(SupportReportErrorType)
  errorType: SupportReportErrorType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUUID()
  companyId: string;
}
