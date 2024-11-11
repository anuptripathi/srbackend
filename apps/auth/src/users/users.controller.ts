import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/users-create-dto';
import {
  Actions,
  CurrentUser,
  CurrentUserDto,
  RequiredCapability,
  Subject,
  Subjects,
} from '@app/common';
import { JwtAuthGaurd } from '../guards/jwt-auth.gaurd';
import { UsersUpdateDto } from './dto/users-update-dto';
import { CapabilityGuard } from '../guards/capability.guard';

@Controller(Subjects.USERS)
@Subject(Subjects.USERS)
@UseGuards(JwtAuthGaurd, CapabilityGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequiredCapability(Actions.ADD)
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    console.log(user);
    return this.usersService.createUser(usersCreateDto, user.userId);
  }

  @Patch(':id')
  @RequiredCapability(Actions.EDIT)
  async updateSelected(
    @Body() updateUserDto: UsersUpdateDto,
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser(updateUserDto, user, id);
  }

  @Patch()
  @RequiredCapability(Actions.EDIT)
  async update(
    @Body() updateUserDto: UsersUpdateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.updateUser(updateUserDto, user);
  }

  @Get('me')
  @RequiredCapability(Actions.READ)
  getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }

  @Get()
  @RequiredCapability(Actions.READ)
  async getUserAll(
    @CurrentUser() user: CurrentUserDto,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('uType') uType?: string,
  ) {
    return await this.usersService.findAll(
      user,
      limit,
      offset,
      name,
      email,
      uType,
    );
  }
}
