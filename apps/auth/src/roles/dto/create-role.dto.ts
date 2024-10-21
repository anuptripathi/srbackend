import {
  IsString,
  IsArray,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Actions, Subjects } from '@app/common';

class PermissionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Subjects)
  subject: Subjects;

  @IsEnum(Actions, { each: true })
  actions: Actions[];
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(200)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
