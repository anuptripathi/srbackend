import { UserTypes } from '../users/user.types';
import { UsersDocument as User } from '../users/users.schema';

export function isAccountOwner(user: User) {
  return user._id.toString() === user.accountId;
}

export function isAccountOwnerAdmin(user: User) {
  return isAccountOwner(user) && user.uType === UserTypes.ADMIN;
}
