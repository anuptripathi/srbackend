import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesRepository } from '../roles/roles.repository';
import { Actions, UserTypes } from '@app/common';

@Injectable()
export class CapabilityService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async checkCapability(payload: any): Promise<boolean> {
    const { currentUser, subject, actions } = payload;
    console.log(currentUser, subject, actions);
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

      console.log('rolerolerolerole', role);

      if (!role && currentUser.uType === UserTypes.SUPERADMIN) {
        return true;
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
