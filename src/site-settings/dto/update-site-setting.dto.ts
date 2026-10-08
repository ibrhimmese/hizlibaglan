import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSiteSettingDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
