// metrics.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMetricsDto } from './createMetrics.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetricsDocument } from './metrics.schema'; // Assume this schema is defined
import { MetricsRepository } from './metrics.repository';
import { CurrentUserDto } from '@app/common';

@Injectable()
export class MetricsService {
  constructor(private readonly metricModel: MetricsRepository) {}

  async saveMetrics(
    metrics: CreateMetricsDto[],
    user: CurrentUserDto,
  ): Promise<void> {
    try {
      // Insert multiple metrics at once
      if (metrics && metrics?.length > 0) {
        const userData = {
          ownerId: user.userId,
          addedBy: user.userId,
          accountId: user?.accountId,
          partnerId: user?.partnerId,
          host: metrics[0]?.tags.host,
        };
        console.log('userData (createMany)', userData);
        await this.metricModel.createMany(metrics, userData);
        console.log('metrics saved successfully');
      } else {
        throw new Error('Metrics array was not populated');
      }
    } catch (error) {
      console.error('Error saving metrics:', error);
      throw new Error('Failed to save metrics');
    }
  }

  async findAll() {
    return this.metricModel.find({});
  }
}
