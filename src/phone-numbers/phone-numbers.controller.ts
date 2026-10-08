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
import { PhoneNumbersService } from './phone-numbers.service';
import { CreatePhoneNumberDto } from './dto/create-phone-number.dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SetWorkingStatusPhoneNumberDto } from './dto/set-working-status-phone-number.dto';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@Controller('phone-numbers')
export class PhoneNumbersController {
  constructor(private readonly phoneNumbersService: PhoneNumbersService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createPhoneNumberDto: CreatePhoneNumberDto) {
    return this.phoneNumbersService.create(createPhoneNumberDto);
  }

  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.phoneNumbersService.findById(id);
  }

  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Get('/company/:companyId')
  findByCompanyId(@Param('companyId', ParseUUIDPipe) id: string) {
    return this.phoneNumbersService.findByCompanyId(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
  ) {
    return this.phoneNumbersService.update(id, updatePhoneNumberDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.phoneNumbersService.remove(id);
  }

  @Patch('working-status/:id')
  setWorkingStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() setWorkingStatusPhoneNumberDto: SetWorkingStatusPhoneNumberDto,
  ) {
    return this.phoneNumbersService.setWorkingStatus(
      id,
      setWorkingStatusPhoneNumberDto.isWorking,
    );
  }
}
