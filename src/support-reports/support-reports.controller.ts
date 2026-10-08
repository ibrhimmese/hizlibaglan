import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SupportReportsService } from './support-reports.service';
import { CreateSupportReportDto } from './dto/create-support-report.dto';
import { UpdateSupportReportDto } from './dto/update-support-report.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('support-reports')
export class SupportReportsController {
  constructor(private readonly supportReportsService: SupportReportsService) {}

  @Post()
  create(@Body() createSupportReportDto: CreateSupportReportDto) {
    return this.supportReportsService.create(createSupportReportDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.supportReportsService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportReportsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupportReportDto: UpdateSupportReportDto,
  ) {
    return this.supportReportsService.update(id, updateSupportReportDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportReportsService.remove(id);
  }
}
