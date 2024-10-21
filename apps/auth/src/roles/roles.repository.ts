import { AbstractRepository } from '@app/common';
import { RoleDocument } from './role.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesRepository extends AbstractRepository<RoleDocument> {
  protected readonly logger = new Logger(RolesRepository.name);

  constructor(
    @InjectModel(RoleDocument.name) roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }
}
