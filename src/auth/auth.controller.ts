import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as jwtPayloadDto from '../common/dto/jwt-payload.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptionalAuthGuard } from './guards/optional-auth.guard'; // (email, password içeren basit bir DTO yapmalısın)

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 300, ttl: 60000 } }) // Dakikada max 300 deneme!
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @ApiBearerAuth()
  @Get('verify')
  @UseGuards(OptionalAuthGuard)
  verifyToken(@CurrentUser() user: jwtPayloadDto.JwtPayloadDto) {
    return {
      isValid: true,
      user: user,
    };
  }
}
