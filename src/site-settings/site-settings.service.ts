import { Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SiteSettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(SiteSetting)
    private siteSettingRepository: Repository<SiteSetting>,
  ) {}

  async onModuleInit() {
    await this.createDefaultSettings();
  }

  private async createDefaultSettings() {
    const count = await this.siteSettingRepository.count();

    if (count === 0) {
      const defaultSettings = [
        { key: 'site_name', value: 'My Awesome Site' },
        { key: 'site_description', value: 'The best site ever' },
        { key: 'contact_fullname', value: '' },
        { key: 'contact_email', value: '' },
        { key: 'logo_url', value: '' },
        { key: 'favicon_url', value: '' },
      ];

      for (const setting of defaultSettings) {
        const siteSetting = this.siteSettingRepository.create(setting);
        await this.siteSettingRepository.save(siteSetting);
      }
    }
  }

  async findAll() {
    return await this.siteSettingRepository.find();
  }

  async findOneByKey(key: string) {
    const siteSetting = await this.siteSettingRepository.findOne({
      where: { key },
    });
    if (!siteSetting) {
      throw new Error(`Site setting with key ${key} not found`);
    }
    return siteSetting;
  }

  async updateByKey(key: string, updateSiteSettingDto: UpdateSiteSettingDto) {
    const siteSetting = await this.findOneByKey(key);
    siteSetting.value = updateSiteSettingDto.value;
    return await this.siteSettingRepository.save(siteSetting);
  }
}
