import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.siteSettingsService.findAll();
  }

  @Get(':key')
  findOneByKey(@Param('key') key: string) {
    return this.siteSettingsService.findOneByKey(key);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() updateSiteSettingDto: UpdateSiteSettingDto,
  ) {
    return this.siteSettingsService.updateByKey(key, updateSiteSettingDto);
  }
}
