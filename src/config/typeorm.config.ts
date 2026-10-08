import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// 1. CLI'ın ve ortamın çevre değişkenlerini okuyabilmesi için
config();

// ============================================================================
// BÖLÜM 1: NESTJS ÇALIŞMA ZAMANI İÇİN (Senin yazdığın kısım)
// ============================================================================
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      autoLoadEntities: true,
      synchronize: false, // Artık hep false, çünkü migration kullanacağız
    };
  }
}

// ============================================================================
// BÖLÜM 2: TYPEORM CLI (TERMİNAL) İÇİN SAF VERİ KAYNAĞI
// ============================================================================
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,

  // CLI'ın tabloları ve migrationları bulacağı yerler
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
