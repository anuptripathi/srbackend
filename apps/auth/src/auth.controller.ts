import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGaurd } from './guards/local-auth.gaurd';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
  CurrentUserDto,
} from '@app/common';
import { Response } from 'express';
import { JwtAuthGaurd } from './guards/jwt-auth.gaurd';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGaurd)
  @Post('login')
  async login(
    @CurrentUser() user: CurrentUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGaurd)
  async authenticate(@Payload() data: any) {
    console.log('authenticate with data', data);
    return data.user;
  }
}
