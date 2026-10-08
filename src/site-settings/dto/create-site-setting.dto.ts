import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSiteSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
