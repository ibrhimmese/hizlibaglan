import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Sayfa numarası (Varsayılan: 1)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number) // URL'den gelen string "1"i sayıya çevirir
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Sayfa başına veri sayısı (Varsayılan: 10)',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number = 10;
}
