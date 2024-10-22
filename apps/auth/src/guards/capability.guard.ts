import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUserDto } from '@app/common';
import { CAPABILITY_KEY, SUBJECT_KEY } from '@app/common';
import { CapabilityService } from '../capability/capability.service';

@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly capabilityService: CapabilityService,
  ) {}

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
      const hasPermission = await this.capabilityService.checkCapability({
        currentUser: user,
        subject: subject,
        actions: requiredCapabilities,
      });

      return hasPermission;
    } catch (error) {
      console.error(
        'Error checking capability via directCheck in auth app',
        error,
      );
      return false; // Deny access in case of any error
    }
  }
}
