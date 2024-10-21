import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserTypes } from '../user.types';

export class UsersCreateDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserTypes, { message: 'Invalid user type' })
  uType: UserTypes;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}
