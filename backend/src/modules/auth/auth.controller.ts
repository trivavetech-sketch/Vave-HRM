import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    // TODO: look up user from DB, validate password, return token
    return { message: 'Login endpoint — implement user lookup' };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const hashedPassword = await this.authService.hashPassword(dto.password);
    // TODO: create user record in DB
    return { message: 'Registration endpoint — implement user creation', hashedPassword };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    // TODO: implement refresh token rotation
    return { message: 'Refresh endpoint — implement token rotation' };
  }
}
