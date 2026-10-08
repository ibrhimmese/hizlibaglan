import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCompanyDto {
  @ApiProperty({
    description: 'Aranacak kurum adı (En az 3 karakter)',
    example: 'Garanti Pendik',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'Arama yapmak için en az 3 karakter girmelisiniz.' })
  searchText: string;
}
