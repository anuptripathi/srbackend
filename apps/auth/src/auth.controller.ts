import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGaurd } from './guards/local-auth.gaurd';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CheckPermissionsRequest,
  CurrentUser,
  CurrentUserDto,
  GetUserByIdRequest,
  GetUserByIdResponse,
} from '@app/common';
import { Response } from 'express';
import { JwtAuthGaurd } from './guards/jwt-auth.gaurd';
import { Payload } from '@nestjs/microservices';
import { UsersService } from './users/users.service';
import { CapabilityService } from './capability/capability.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly capabilityService: CapabilityService,
    private readonly userService: UsersService,
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

  @UseGuards(JwtAuthGaurd) // checks Authentication:jwt in the request, parse the jwt, and pass in Payload data.
  async authenticate(@Payload() data: any) {
    console.log('authenticated with data on AuthController', data?.user);
    return { ...data.user };
  }

  async checkPermissions(data: CheckPermissionsRequest) {
    console.log(data);
    const hasPermission = await this.capabilityService.checkCapability(data);
    // Return response in the expected format
    return { hasPermission };
  }

  async getUserById(request: GetUserByIdRequest): Promise<any> {
    const userId = request.userId;
    console.log('getUserById', userId);

    const userObj = await this.userService.getUserById(userId);

    // Return response in the expected format
    return { userObj };
  }
}
