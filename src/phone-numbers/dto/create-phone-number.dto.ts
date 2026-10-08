import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePhoneNumberDto {
  @IsString()
  title: string;

  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  sequence?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  order: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsUUID()
  companyId: string;
}
