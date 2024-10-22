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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  CurrentUser,
  CurrentUserDto,
  RequiredUserType,
  JwtAuthGaurd,
  UserTypeGuard,
  UserTypes,
  Subjects,
  Subject,
  RequiredCapability,
  Actions,
} from '@app/common';
import { CapabilityGuard } from '../guards/capability.guard';

@Controller(Subjects.PERMISSIONS)
@Subject(Subjects.PERMISSIONS)
@RequiredUserType(UserTypes.SUPERADMIN) // only super admin can create/view a new permissions from ui
@UseGuards(JwtAuthGaurd, UserTypeGuard, CapabilityGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequiredCapability(Actions.ADD)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @RequiredCapability(Actions.READ)
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @RequiredCapability(Actions.READ)
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @RequiredCapability(Actions.EDIT)
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @RequiredCapability(Actions.DELETE)
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
