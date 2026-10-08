import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePhoneNumberDto } from './create-phone-number.dto';

export class UpdatePhoneNumberDto extends PartialType(
  OmitType(CreatePhoneNumberDto, ['companyId'] as const),
) {}
