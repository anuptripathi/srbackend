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
      ownerId: user.userId,
      accountId: user.accountId,
      partnerId: user.partnerId,
    });
  }

  async findAll(
    user: CurrentUserDto,
    limit: number = 10,
    offset: number = 0,
    title?: string,
    subject?: string,
  ) {
    const ownershipCondition =
      this.permissionsRepository.getOwnershipCondition(user);
    let condition = ownershipCondition;
    if (title)
      condition = { ...condition, title: { $regex: title, $options: 'i' } };
    if (subject)
      condition = { ...condition, subject: { $regex: subject, $options: 'i' } };

    const data = await this.permissionsRepository.find(
      condition,
      limit,
      offset,
    );
    const estimatedCount =
      await this.permissionsRepository.estimatedDocumentCount();

    if (estimatedCount <= 10000) {
      const totalRecords =
        await this.permissionsRepository.countDocuments(condition);
      return { data, totalRecords, cursorBased: false };
    } else {
      return { data, cursorBased: true };
    }
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
