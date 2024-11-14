import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { MetricsDocument } from './metrics.schema';
import { Model } from 'mongoose';

@Injectable()
export class MetricsRepository extends AbstractRepository<MetricsDocument> {
  protected readonly logger = new Logger(MetricsRepository.name);
  constructor(
    @InjectModel(MetricsDocument.name)
    private readonly metricsModel: Model<MetricsDocument>,
  ) {
    super(metricsModel);
  }
}
