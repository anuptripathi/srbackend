import { AbstractRepository } from '@app/common';
import { PermissionDocument } from './permission.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PermissionsRepository extends AbstractRepository<PermissionDocument> {
  protected readonly logger = new Logger(PermissionsRepository.name);

  constructor(
    @InjectModel(PermissionDocument.name) permissionModel: Model<PermissionDocument>,
  ) {
    super(permissionModel);
  }
}
