import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto'; // Express'ten import etmeyi unutma
// Token'dan dönen verinin tipini buraya import etmelisin (Örn: User entity'si veya JwtPayload interface'i)

// 1. Kendi Request tipimizi tanımlıyoruz ve içine 'user' objesini zorunlu kılıyoruz
export interface CustomRequest extends Request {
  user: JwtPayloadDto; // (Eğer Payload interface'in yoksa buraya User entity'ni de yazabilirsin)
}

export const CurrentUser = createParamDecorator(
  // 2. Dönüş tipini de açıkça belirtiyoruz
  (data: unknown, ctx: ExecutionContext): JwtPayloadDto => {
    // 3. getRequest içine tipimizi veriyoruz. Artık request'in ne olduğu kesin belli!
    const request = ctx.switchToHttp().getRequest<CustomRequest>();

    return request.user;
  },
);
