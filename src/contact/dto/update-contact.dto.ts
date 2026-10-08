import { RequestStatus } from '../../common/request-status-enum';
import { IsEnum } from 'class-validator';

export class UpdateContactDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
