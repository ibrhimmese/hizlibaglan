import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // 1. Durum: Standart NestJS HTTP Hataları (404, 400, 401 vs.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Validation hataları bazen array döner, onları string'e çevirelim veya olduğu gibi alalım
      message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse as any).message
          : exception.message;
    }
    // 2. Durum: TypeORM Hataları (Veritabanı)
    else if (exception instanceof QueryFailedError) {
      // Postgres Hata Kodları: 23505 = Unique Constraint (Tekrar eden kayıt)
      if (exception.driverError.code === '23505') {
        status = HttpStatus.CONFLICT; // 409
        message =
          'Bu kayıt zaten mevcut. Lütfen farklı verilerle tekrar deneyin.';
      } else {
        message = 'Veritabanı işlemi sırasında bir hata oluştu.';
        // Detaylı hatayı loglayalım ama kullanıcıya göstermeyelim
        this.logger.error(
          `Database Error: ${exception.message}`,
          exception.stack,
        );
      }
    }
    // 3. Durum: Beklenmeyen Diğer Hatalar
    else {
      this.logger.error(
        `Unknown Error: ${exception}`,
        (exception as Error).stack,
      );
    }

    // SONUÇ: Standart Hata Formatı
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message, // Artık mesaj her zaman kullanıcı dostu
      // error: exception.constructor.name, // Development ortamında açabilirsin
    });
  }
}
