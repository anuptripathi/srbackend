import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  CurrentUser,
  CurrentUserDto,
  RequiredUserType,
  JwtAuthGaurd,
  UserTypeGuard,
  UserTypes,
  Subject,
  RequiredCapability,
  Subjects,
  Actions,
} from '@app/common';
// in auth app, call this gaurd form capability guard,
//but in other app/microceservies call it from @app/common.
import { CapabilityGuard } from '../guards/capability.guard';

@Controller(Subjects.ROLES)
@Subject(Subjects.ROLES)
@RequiredUserType(UserTypes.ADMIN)
@UseGuards(JwtAuthGaurd, UserTypeGuard, CapabilityGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @RequiredCapability(Actions.READ)
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
