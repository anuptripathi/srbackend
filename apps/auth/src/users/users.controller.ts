import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/users-create-dto';
import { CurrentUser, CurrentUserDto } from '@app/common';
import { JwtAuthGaurd } from '../guards/jwt-auth.gaurd';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGaurd)
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.createUser(usersCreateDto, user?.userId);
  }

  @Get()
  @UseGuards(JwtAuthGaurd)
  getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
}
