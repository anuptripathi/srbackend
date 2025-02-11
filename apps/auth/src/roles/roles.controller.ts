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
  JwtAuthGaurd,
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
@UseGuards(JwtAuthGaurd, CapabilityGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequiredCapability(Actions.ADD)
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
  @RequiredCapability(Actions.READ)
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequiredCapability(Actions.EDIT)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @RequiredCapability(Actions.DELETE)
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
