import { AbstractRepository } from '@app/common';
import { MetricsDocument } from './metrics.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MetricsRepository extends AbstractRepository<MetricsDocument> {
  protected readonly logger = new Logger(MetricsRepository.name);

  constructor(
    @InjectModel(MetricsDocument.name) metricsModel: Model<MetricsDocument>,
  ) {
    super(metricsModel);
  }
}
