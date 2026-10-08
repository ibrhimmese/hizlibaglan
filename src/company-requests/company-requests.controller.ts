import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CompanyRequestsService } from './company-requests.service';
import { CreateCompanyRequestDto } from './dto/create-company-request.dto';
import { UpdateCompanyRequestDto } from './dto/update-company-request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('company-requests')
export class CompanyRequestsController {
  constructor(
    private readonly companyRequestsService: CompanyRequestsService,
  ) {}

  @Post()
  create(@Body() createCompanyRequestDto: CreateCompanyRequestDto) {
    return this.companyRequestsService.create(createCompanyRequestDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.companyRequestsService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyRequestsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyRequestDto: UpdateCompanyRequestDto,
  ) {
    return this.companyRequestsService.update(id, updateCompanyRequestDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyRequestsService.remove(id);
  }
}
