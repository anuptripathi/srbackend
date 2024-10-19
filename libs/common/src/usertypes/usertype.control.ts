import { Injectable } from '@nestjs/common';
import { UserLevels, UserTypes } from './usertype.types';

interface IsAuthorizedParams {
  currentUserType: UserTypes;
  requiredUserType: UserTypes;
}

@Injectable()
export class UserTypeContorl {
  public isAuthorized({
    currentUserType,
    requiredUserType,
  }: IsAuthorizedParams) {
    const userTypeLevels = new UserLevels();
    console.log(
      '...provided tyeps are',
      currentUserType,
      requiredUserType,
      userTypeLevels[currentUserType],
      userTypeLevels[requiredUserType],
    );
    if (userTypeLevels[currentUserType] >= userTypeLevels[requiredUserType]) {
      return true;
    }
    return false;
  }
}

/*const control = new UserTypeContorl();
const r1: UserTypes = UserTypes.ADMIN;
const checkit: IsAuthorizedParams = {
  currentRole: r1,
  requiredRole: r1,
};
const isvalid = control.isAuthorized(checkit);*/
