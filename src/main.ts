import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import morgan from 'morgan';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Servise erişim

  app.use(morgan('dev'));

  const frontendUrls = configService
    .get<string>('FRONTEND_URLS')
    ?.split(',')
    .map((url) => url.trim());

  // --- CORS AYARLARI ---
  app.enableCors({
    // Hem .env'den gelen adrese, hem de yerel testler için localhost ve 127.0.0.1'e izin veriyoruz
    origin: frontendUrls,

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 1. Gelen verileri (Request) validate etmek için (DTO'lar çalışır)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 2. Giden verileri (Response) validate etmek için (Entity/DTO kuralları çalışır)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 2. GLOBAL EXCEPTION FILTER (Buraya ekle)
  app.useGlobalFilters(new AllExceptionsFilter());

  // --- Swagger Şifre Koruması Başlangıcı ---
  // Swagger rotalarınızı koruma altına alın (örneğin '/api' ve Swagger JSON'u için '/api-json')
  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        admin: configService.get<string>('SWAGGER_PASS') || 'oktayparlak', // Kendi belirleyeceğiniz kullanıcı adı:şifre kombinasyonu
      },
    }),
  );
  // --- Swagger Şifre Koruması Bitişi ---

  const config = new DocumentBuilder()
    .setTitle('Hızlı Bağlan API')
    .setDescription(
      'Müşteri temsilcilerine hızlı bağlanma servisi API dokümantasyonu',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api adresinde çalışacak

  const PORT: number = configService.get<number>('PORT') ?? 3000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
