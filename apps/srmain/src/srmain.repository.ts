import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { SrmainDocument } from './models/srmain.schema';
import { Model } from 'mongoose';

@Injectable()
export class SrmainRepository extends AbstractRepository<SrmainDocument> {
  protected readonly logger = new Logger(SrmainRepository.name);
  constructor(
    @InjectModel(SrmainDocument.name)
    private readonly srmainModel: Model<SrmainDocument>,
  ) {
    super(srmainModel);
  }
}
