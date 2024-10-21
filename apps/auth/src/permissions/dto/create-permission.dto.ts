import { IsString, IsArray, IsNotEmpty, IsEnum } from 'class-validator';
import { UserTypes, Actions, Subjects } from '@app/common';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Subjects)
  subject: Subjects;

  @IsArray()
  @IsEnum(Actions, { each: true })
  actions: Actions[];

  @IsEnum(UserTypes)
  uType: UserTypes;
}
