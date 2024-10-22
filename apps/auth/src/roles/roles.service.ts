import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';
import { Actions, CurrentUserDto, UserTypes } from '@app/common';
import { UsersService } from '../users/users.service';
import { catchError } from 'rxjs';

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
    const { currentUser, subject, actions } = payload;
    console.log('currentUser', currentUser);
    console.log('subject', subject);
    console.log('actions', actions);
    if (!currentUser) {
      return false;
    }

    try {
      const role = await this.rolesRepository.findOne(
        {
          _id: currentUser.roleId,
        },
        false,
      );

      if (!role) {
        // if no roles set then throw exception, expect for superadmin.
        if (currentUser.uType === UserTypes.SUPERADMIN) {
          return true;
        }
      }

      return role.permissions.some(
        (permission) =>
          permission.subject === subject &&
          actions.every((action) =>
            permission.actions.includes(action as Actions),
          ),
      );
    } catch (err) {
      throw new UnauthorizedException('Unauthorized roles and capability');
    }
  }
}
