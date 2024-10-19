import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UsersCreateDto } from './users-create-dto';

export class UsersUpdateDto extends PartialType(
  OmitType(UsersCreateDto, ['password']),
) {}
