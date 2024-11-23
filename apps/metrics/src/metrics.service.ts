// metrics.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMetricsDto } from './createMetrics.dto';
import { MetricsRepository } from './metrics.repository';
import { CurrentUserDto } from '@app/common';
import { Types } from 'mongoose';
import { transformMetric } from './helper';
import {
  getAgoToSeconds,
  getStartOfTimeFromAgo,
  getUnitAndNumberFromAgoRange,
} from '@app/common';

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
        };
        const preparedDocuments = metrics.map(transformMetric).map((doc) => ({
          ...doc,
          host: doc.tags.host,
          _id: new Types.ObjectId(), // Ensure each document has a unique _id
          ...userData,
        }));
        console.log('userData (createMany)', preparedDocuments);
        await this.metricModel.createMany(preparedDocuments);
        // console.log('metrics saved successfully', metrics);
      } else {
        throw new Error('Metrics array was not populated');
      }
    } catch (error) {
      console.error('Error saving metrics:', error);
      throw new Error('Failed to save metrics');
    }
  }

  async findAll() {
    return this.metricModel.find({}, 20);
  }

  async getCpuUsage(timeRange: string): Promise<any> {
    try {
      let interval = 10; //seconds
      let recordLimit = 120;
      const rangeInseconds = getAgoToSeconds(timeRange);
      if (rangeInseconds > recordLimit) {
        interval = rangeInseconds / recordLimit;
      }
      console.log(
        'Time in give timeragen ',
        timeRange,
        getAgoToSeconds(timeRange),
        interval,
      );
      const startTimestamp = getStartOfTimeFromAgo(timeRange);
      console.log('startTimestamp', startTimestamp);
      const metrics = await this.metricModel.aggregate([
        //Condition
        {
          $match: {
            name: 'cpu', // Example filter: only include documents where `name` is "cpu"
            timestamp: { $gte: startTimestamp }, // Filter by timestamp
          },
        },
        // Step 1: Add an interval key
        {
          $addFields: {
            intervalBucket: {
              $multiply: [
                { $floor: { $divide: ['$timestamp', interval] } }, // Divide by interval and round down
                interval, // Multiply back by 10 to get the bucket start
              ],
            },
          },
        },
        // Step 2: Group by interval
        {
          $group: {
            _id: '$intervalBucket', // Group by interval start
            avgUsageActive: { $avg: '$fields.usage_active' }, // Average for usage_active
            avgUsageSystem: { $avg: '$fields.usage_system' }, // Average for usage_system
            avgUsageUser: { $avg: '$fields.usage_user' }, // Average for usage_user
            count: { $sum: 1 }, // Count of records in the interval
          },
        },
        // Step 3: Format the output
        {
          $project: {
            _id: 0,
            intervalBucket: '$_id',
            avgUsageActive: 1,
            avgUsageSystem: 1,
            avgUsageUser: 1,
            count: 1,
          },
        },
        // Step 4: Sort by interval start (optional)
        {
          $sort: { intervalBucket: 1 },
        },
        // Step 5: Limit the result (optional)
        {
          $limit: recordLimit, // Example limit: return only the first 100 records
        },
      ]);

      if (!metrics || metrics.length === 0) {
        console.log(
          'No CPU metrics found for the provided host and time range',
        );
      }

      return { metrics, intervalSec: interval };
    } catch (error) {
      console.error('Error fetching CPU usage:', error);
      throw new Error('Failed to fetch CPU usage');
    }
  }

  async getMemUsage(timeRange: string): Promise<any> {
    try {
      let interval = 10; //seconds
      let recordLimit = 120;
      const rangeInseconds = getAgoToSeconds(timeRange);
      if (rangeInseconds > recordLimit) {
        interval = rangeInseconds / recordLimit;
      }
      console.log(
        'Time in give timeragen ',
        timeRange,
        getAgoToSeconds(timeRange),
        interval,
      );
      const startTimestamp = getStartOfTimeFromAgo(timeRange);
      console.log('startTimestamp', startTimestamp);
      const metrics = await this.metricModel.aggregate([
        //Condition
        {
          $match: {
            name: 'mem', // Example filter: only include documents where `name` is "mem"
            timestamp: { $gte: startTimestamp }, // Filter by timestamp
          },
        },
        // Step 1: Add an interval key
        {
          $addFields: {
            intervalBucket: {
              $multiply: [
                { $floor: { $divide: ['$timestamp', interval] } }, // Divide by interval and round down
                interval, // Multiply back by 10 to get the bucket start
              ],
            },
          },
        },
        // Step 2: Group by interval
        {
          $group: {
            _id: '$intervalBucket', // Group by interval start
            totalMemory: { $avg: '$fields.total' }, // Average for usage_active
            usePercent: { $avg: '$fields.used_percent' }, // Average for usage_system
            avalPercent: { $avg: '$fields.available_percent' }, // Average for usage_user
            count: { $sum: 1 }, // Count of records in the interval
          },
        },
        // Step 3: Format the output
        {
          $project: {
            _id: 0,
            intervalBucket: '$_id',
            totalMemory: 1,
            usePercent: 1,
            avalPercent: 1,
            count: 1,
          },
        },
        // Step 4: Sort by interval start (optional)
        {
          $sort: { intervalBucket: 1 },
        },
        // Step 5: Limit the result (optional)
        {
          $limit: recordLimit, // Example limit: return only the first 100 records
        },
      ]);

      if (!metrics || metrics.length === 0) {
        console.log(
          'No Mem metrics found for the provided host and time range',
        );
      }

      return { metrics, intervalSec: interval };
    } catch (error) {
      console.error('Error fetching Mem usage:', error);
      throw new Error('Failed to fetch Mem usage');
    }
  }
}
