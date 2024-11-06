import { PartialType } from '@nestjs/mapped-types';
import { UsersCreateDto } from './users-create-dto';

export class UsersUpdateDto extends PartialType(UsersCreateDto) {}
