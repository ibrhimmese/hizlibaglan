import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number; // Limit

  @ApiProperty()
  readonly itemCount: number; // O sayfadaki veri sayısı

  @ApiProperty()
  readonly pageCount: number; // Toplam sayfa sayısı

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(
    paginationQueryDto: PaginationQueryDto,
    itemCount: number,
    totalItems: number,
  ) {
    this.page = paginationQueryDto.page;
    this.take = paginationQueryDto.limit;
    this.itemCount = itemCount; // O anki sayfada kaç veri var
    this.pageCount = Math.ceil(totalItems / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
