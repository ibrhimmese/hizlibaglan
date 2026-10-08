import { PartialType } from '@nestjs/swagger';
import { CreateCompanyRequestDto } from './create-company-request.dto';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../../common/request-status-enum';

export class UpdateCompanyRequestDto extends PartialType(
  CreateCompanyRequestDto,
) {
  @IsEnum(RequestStatus)
  requestStatus: RequestStatus;
}
