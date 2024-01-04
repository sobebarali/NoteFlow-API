import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      const { password, ...result } = user.toObject();
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
