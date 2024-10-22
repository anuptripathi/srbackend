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
} from '@app/common';

@Controller(Subjects.PERMISSIONS)
@Subject(Subjects.PERMISSIONS)
@RequiredUserType(UserTypes.SUPERADMIN)
@UseGuards(JwtAuthGaurd, UserTypeGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
