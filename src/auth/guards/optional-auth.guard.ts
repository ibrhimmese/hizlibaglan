import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from '../../common/dto/request-with-user.interface';
import { JwtPayloadDto } from '../../common/dto/jwt-payload.dto';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. ÇÖZÜM: getRequest() varsayılan olarak 'any' döndüğü için 'as' ile tipini kesinleştiriyoruz.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      request.user = null;
      return true;
    }

    try {
      // Secret değerini değişkene alarak tipini netleştiriyoruz
      const secret = this.configService.get<string>('JWT_SECRET');

      // 2. ÇÖZÜM: verifyAsync 'any' döndüğü için, parantez içine alıp sonucun 'JwtPayload' olduğunu garanti ediyoruz.
      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
        secret: secret,
      });

      request.user = payload;
    } catch {
      // Hata olsa bile (token geçersiz vs.) misafir olarak devam etmesine izin veriyoruz
      request.user = null;
    }

    return true;
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    // 3. ÇÖZÜM: request.headers.authorization undefined olma ihtimaline karşı optional chaining (?.) kullanıyoruz
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
