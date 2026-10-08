import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  order: number;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
