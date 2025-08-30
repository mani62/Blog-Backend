import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   *
   * @description
   * Register a new user and return a JWT access token.
   *
   * @request-body
   * {
   *   "email": "user1@example.com",
   *   "password": "securePassword123",
   *   "name": "user one"
   * }
   *
   * @response
   * {
   *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
   * }
  */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   *
   * @description
   * Authenticate a user with email/password and return a JWT token.
   *
   * @request-body
   * {
   *   "email": "user1@example.com",
   *   "password": "securePassword123"
   * }
   *
   * @response
   * {
   *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5..."
   * }
  */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
