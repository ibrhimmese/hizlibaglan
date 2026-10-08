import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  logoUrl: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  @Min(1)
  order: number;

  @IsUUID()
  @IsString()
  subCategoryId: string;
}
