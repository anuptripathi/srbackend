export enum UserTypes {
  SUPERADMIN = 'superadmin',
  PARTNER = 'partner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  ENDUSER = 'enduser',
}

export class UserLevels {
  [UserTypes.SUPERADMIN] = 500;
  [UserTypes.PARTNER] = 400;
  [UserTypes.ADMIN] = 300;
  [UserTypes.MODERATOR] = 200;
  [UserTypes.ENDUSER] = 100;
}
