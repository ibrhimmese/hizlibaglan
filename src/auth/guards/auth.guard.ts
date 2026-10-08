import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // İstekte token bulunamazsa doğrudan yetkisiz işlem hatası fırlatır ve isteği keser.
    if (!token) {
      throw new UnauthorizedException('Yetkisiz erişim: Token bulunamadı.');
    }

    try {
      // Token'ın geçerliliğini ve imzasını kontrol eder.
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Token geçerliyse, içindeki verileri (payload) request.user nesnesine atar.
      request['user'] = payload;
    } catch {
      // Token'ın süresi dolmuşsa veya imza yanlışsa yetkisiz işlem hatası fırlatır ve isteği keser.
      throw new UnauthorizedException(
        'Yetkisiz erişim: Geçersiz veya süresi dolmuş token.',
      );
    }

    // Tüm kontrollerden geçerse Controller'a erişime izin verir.
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
