export enum UserTypes {
  SUPERADMIN = 'superadmin',
  PARTNER = 'partner',
  ADMIN = 'admin',
  ENDUSER = 'enduser', // can be moderator/supervisor as per role/permission
}

export class UserLevels {
  [UserTypes.SUPERADMIN] = 500;
  [UserTypes.PARTNER] = 400;
  [UserTypes.ADMIN] = 300;
  [UserTypes.ENDUSER] = 100; // can be moderator/supervisor as per role/permission
}
