import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { CompaniesModule } from './companies/companies.module';
import { PhoneNumbersModule } from './phone-numbers/phone-numbers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CompanyRequestsModule } from './company-requests/company-requests.module';
import { SupportReportsModule } from './support-reports/support-reports.module';
import { ContactModule } from './contact/contact.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL') || 60000, // 60 saniye
          limit: config.get<number>('THROTTLE_LIMIT') || 10, // 10 istek
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CategoriesModule,
    CompaniesModule,
    PhoneNumbersModule,
    UsersModule,
    AuthModule,
    SubCategoriesModule,
    CompanyRequestsModule,
    SupportReportsModule,
    ContactModule,
    SiteSettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
