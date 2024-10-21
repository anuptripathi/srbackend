import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';
import { Actions, CurrentUserDto } from '@app/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly userService: UsersService,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: CurrentUserDto) {
    const userObj = await this.userService.getUserById(user.userId);
    return this.rolesRepository.create({
      ...createRoleDto,
      addedBy: user.userId,
      ownerId: user.userId,
      ancestorIds: userObj.ancestorIds,
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

  async checkCapability(payload: any): Promise<boolean> {
    const { roleId, subject, actions } = payload;
    const role = await this.rolesRepository.findOne({ _id: roleId });
    console.log(
      'required role is',
      roleId,
      subject,
      actions,
      ' saved is',
      role,
    );
    if (!role) {
      return false;
    }

    return role.permissions.some(
      (permission) =>
        permission.subject === subject &&
        actions.every((action) =>
          permission.actions.includes(action as Actions),
        ),
    );
  }
}
