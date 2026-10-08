import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Company } from './entities/company.entity';
import { ApiPaginatedResponse } from '../common/dto/api-paginated-response.decorator';
import { PageDto } from '../common/dto/page.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import type { RequestWithUser } from '../common/dto/request-with-user.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiPaginatedResponse(Company)
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PageDto<Company>> {
    return this.companiesService.findAll(paginationQuery);
  }

  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.companiesService.findByCategoryId(categoryId);
  }

  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Get('search')
  @ApiOperation({ summary: 'İsme göre şirket araması yapar (Pagination yok)' })
  searchByName(
    @Query() searchCompanyDto: SearchCompanyDto,
  ): Promise<Company[]> {
    return this.companiesService.searchByName(searchCompanyDto.searchText);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOne(id);
  }

  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Get('subcategory/:subcategoryId')
  findBySubCategoryId(
    @Param('subcategoryId', ParseUUIDPipe) subcategoryId: string,
    @Req() request: RequestWithUser,
  ) {
    const isAdmin = !!request.user;
    return this.companiesService.findBySubCategoryId(subcategoryId, isAdmin);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.remove(id);
  }
}
