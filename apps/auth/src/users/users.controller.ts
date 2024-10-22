import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/users-create-dto';
import {
  Actions,
  CurrentUser,
  CurrentUserDto,
  RequiredCapability,
  RequiredUserType,
  Subject,
  Subjects,
  UserTypeGuard,
  UserTypes,
} from '@app/common';
import { JwtAuthGaurd } from '../guards/jwt-auth.gaurd';
import { UsersUpdateDto } from './dto/users-update-dto';
import { CapabilityGuard } from '../guards/capability.guard';

@Controller(Subjects.USERS)
@Subject(Subjects.USERS)
@RequiredUserType(UserTypes.ADMIN)
@RequiredCapability(Actions.READ)
@UseGuards(JwtAuthGaurd, UserTypeGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequiredCapability(Actions.ADD)
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.createUser(usersCreateDto, user.userId);
  }

  @Patch()
  @RequiredCapability(Actions.EDIT)
  async update(
    @Body() updateUserDto: UsersUpdateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.updateUser(updateUserDto, user);
  }

  @Get()
  getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
}
