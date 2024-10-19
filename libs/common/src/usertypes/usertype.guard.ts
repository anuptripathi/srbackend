import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { USERTYPE_KEY } from './usertype.decorator';
import { UserTypes } from './usertype.types';
import { UserTypeContorl } from './usertype.control';
import { CurrentUserDto } from '../dtos';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: UserTypeContorl,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredUserTypes = this.reflector.getAllAndOverride<UserTypes[]>(
      USERTYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const currentUser = request.user as CurrentUserDto;

    console.log(currentUser);

    for (let userType of requiredUserTypes) {
      const result = this.accessControlService.isAuthorized({
        requiredUserType: userType,
        currentUserType: currentUser.uType as UserTypes,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
