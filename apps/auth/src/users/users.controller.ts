import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/users-create-dto';
import { CurrentUser, CurrentUserDto } from '@app/common';
import { JwtAuthGaurd } from '../guards/jwt-auth.gaurd';
import { UsersUpdateDto } from './dto/users-update-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGaurd)
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.createUser(usersCreateDto, user.userId);
  }

  @Patch()
  @UseGuards(JwtAuthGaurd)
  async update(
    @Body() updateUserDto: UsersUpdateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.updateUser(updateUserDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGaurd)
  getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
}
