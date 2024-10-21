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
import { Payload } from '@nestjs/microservices';
import { RolesService } from './roles/roles.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
  ) {}

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
    console.log('authenticated with data on AuthController', data?.user);
    return { ...data.user };
  }

  //@UseGuards(JwtAuthGaurd)
  async checkPermissions(data: any) {
    console.log(data);
    const hasPermission = await this.rolesService.checkCapability(data);
    // Return response in the expected format
    return { hasPermission };
  }
}
