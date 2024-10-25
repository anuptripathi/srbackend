import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';
import { Actions, CurrentUserDto, UserTypes } from '@app/common';
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
      accountId: user.accountId,
      partnerId: user.partnerId,
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
