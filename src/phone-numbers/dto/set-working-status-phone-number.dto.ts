import { IsBoolean } from 'class-validator';

export class SetWorkingStatusPhoneNumberDto {
  @IsBoolean()
  isWorking: boolean;
}
