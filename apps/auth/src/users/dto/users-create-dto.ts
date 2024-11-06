import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { UserTypes } from '../user.types';

export class UsersCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserTypes, { message: 'Invalid user type' })
  uType: UserTypes;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}
