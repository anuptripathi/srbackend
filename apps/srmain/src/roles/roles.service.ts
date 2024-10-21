import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';
import { CurrentUserDto } from '@app/common';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(createRoleDto: CreateRoleDto, user: CurrentUserDto) {
    return this.rolesRepository.create({
      ...createRoleDto,
      addedBy: user.userId,
    });
  }

  async findAll() {
    return this.rolesRepository.find({});
  }

  async findOne(_id: string) {
    return this.rolesRepository.findOne({ _id });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.findOneAndUpdate(
      { _id },
      { $set: updateRoleDto },
    );
  }

  async remove(_id: string) {
    return this.rolesRepository.findOneAndDelete({ _id });
  }
}
