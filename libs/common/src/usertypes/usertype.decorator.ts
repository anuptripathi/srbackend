import { SetMetadata } from '@nestjs/common';
import { UserTypes } from './usertype.types';

export const USERTYPE_KEY = 'u_type';

export const RequiredUserType = (...usertype: UserTypes[]) =>
  SetMetadata(USERTYPE_KEY, usertype);
