import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUserDto } from '@app/common';
import { CAPABILITY_KEY, SUBJECT_KEY } from './capability.decorators';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';

@Injectable()
export class CapabilityGuard implements CanActivate {
  private authService: AuthServiceClient;

  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract required capabilities and subject using Reflector
    const requiredCapabilities = this.reflector.getAllAndOverride<string[]>(
      CAPABILITY_KEY,
      [context.getHandler(), context.getClass()],
    );
    const subject = this.reflector.get<string>(SUBJECT_KEY, context.getClass());

    // If no capabilities or subject is set, allow access by default
    if (!requiredCapabilities || !subject) {
      return true;
    }

    // Get the current user from the request
    const request = context.switchToHttp().getRequest();
    const user: CurrentUserDto = request.user;

    try {
      // Make a gRPC request to auth service to check if the user has the necessary permissions
      const response = await lastValueFrom(
        this.authService.checkPermissions({
          roleId: user.roleId,
          subject: subject,
          actions: requiredCapabilities,
        }),
      );

      return response.hasPermission;
    } catch (error) {
      console.error('Error checking capability via gRPC', error);
      return false; // Deny access in case of any error
    }
  }
}
