import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsRepository } from './permissions.repository';
import { CurrentUserDto } from '@app/common';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async create(createPermissionDto: CreatePermissionDto, user: CurrentUserDto) {
    return this.permissionsRepository.create({
      ...createPermissionDto,
      addedBy: user.userId,
    });
  }

  async findAll() {
    return this.permissionsRepository.find({});
  }

  async findOne(_id: string) {
    return this.permissionsRepository.findOne({ _id });
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsRepository.findOneAndUpdate(
      { _id },
      { $set: updatePermissionDto },
    );
  }

  async remove(_id: string) {
    return this.permissionsRepository.findOneAndDelete({ _id });
  }
}
