import { IsEnum, IsOptional } from 'class-validator';
import { RequestStatus } from '../../common/request-status-enum';

export class UpdateSupportReportDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status: RequestStatus;
}
