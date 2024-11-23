// metrics.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMetricsDto } from './createMetrics.dto';
import { MetricsRepository } from './metrics.repository';
import { CurrentUserDto } from '@app/common';
import {
  getTime,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subSeconds,
  subWeeks,
  subYears,
} from 'date-fns';
import { Types } from 'mongoose';

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

  private getTimeInSeconds(duration: string): number {
    const { value, unit } = this.getUnitAndNumberFromAgoRange(duration);
    switch (unit) {
      case 's': // Seconds
        return value;
      case 'm': // Minutes
        return value * 60;
      case 'h': // Hours
        return value * 60 * 60;
      case 'd': // Days
        return value * 24 * 60 * 60;
      case 'w': // Weeks
        return value * 7 * 24 * 60 * 60;
      case 'mn': // Months (approximate as 30 days)
        return value * 30 * 24 * 60 * 60;
      case 'y': // Years
        return value * 24 * 60 * 60 * 365;
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
  }
  /**
   * Returns the start time based on the provided time range string.
   * Supports "1h" (1 hour), "1d" (1 day), "1w" (1 week), etc.
   * Defaults to "1h" if no valid range is provided.
   * @param timeRange - The time range string (e.g., "1h", "1d", "1w").
   * @returns A Date object representing the start of the time range.
   */
  private getUnitAndNumberFromAgoRange(timeRange: string): { value; unit } {
    const regex = /^(\d+)([hdwmny]{1,2})$/i; // Match number followed by h, d, or w (case insensitive)
    // Use the provided timeRange or fallback to default
    const match = (timeRange || '0h').toLowerCase().match(regex);
    console.log('match', match);
    if (!match) {
      return { value: 0, unit: 'h' };
    }

    const value = parseInt(match[1], 10); // Extract numeric value
    const unit = match[2]; // Extract unit (h, d, w, m)
    return { value, unit };
  }
  private getStartOfTimeRange(
    timeRange: string,
    toUnixTimeStamp: boolean = true,
  ): Date | number {
    const now = new Date();
    let startDate = now;

    const { value, unit } = this.getUnitAndNumberFromAgoRange(timeRange);

    switch (unit) {
      case 's': // Seconds
        startDate = subSeconds(now, value); // Subtract seconds
        break;
      case 'm':
        startDate = subMinutes(now, value); // Subtract minutes
        break;
      case 'h':
        startDate = subHours(now, value); // Subtract hours
        break;
      case 'd':
        startDate = subDays(now, value); // Subtract days
        break;
      case 'w':
        startDate = subWeeks(now, value); // Subtract weeks
        break;
      case 'mn':
        startDate = subMonths(now, value); // Subtract weeks
        break;
      case 'y':
        startDate = subYears(now, value); // Subtract weeks
        break;
    }
    return toUnixTimeStamp ? getTime(startDate) / 1000 : startDate;
  }

  async getCpuUsage(timeRange: string): Promise<any> {
    try {
      let interval = 10; //seconds
      let recordLimit = 120;
      const rangeInseconds = this.getTimeInSeconds(timeRange);
      if (rangeInseconds > recordLimit) {
        interval = rangeInseconds / recordLimit;
      }
      console.log(
        'Time in give timeragen ',
        timeRange,
        this.getTimeInSeconds(timeRange),
        interval,
      );
      const startTimestamp = this.getStartOfTimeRange(timeRange);
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
      const rangeInseconds = this.getTimeInSeconds(timeRange);
      if (rangeInseconds > recordLimit) {
        interval = rangeInseconds / recordLimit;
      }
      console.log(
        'Time in give timeragen ',
        timeRange,
        this.getTimeInSeconds(timeRange),
        interval,
      );
      const startTimestamp = this.getStartOfTimeRange(timeRange);
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

const METRIC_TEMPLATES = {
  mem: {
    fields: ['total', 'used_percent', 'available_percent'], // Only these fields will be saved
    tags: ['host'], // Only these tags will be saved
  },
  cpu: {
    fields: ['usage_active', 'usage_system', 'usage_user'], // Only these fields will be saved
    tags: ['host', 'cpu'], // Only these tags will be saved
  },
  // Add templates for other metric names as needed
};

function transformMetric(metric: any): any {
  const template = METRIC_TEMPLATES[metric.name];

  if (!template) {
    // If no template is defined for this metric, skip it
    return null;
  }

  const transformedMetric = {
    name: metric.name,
    timestamp: metric.timestamp,
    fields: {},
    tags: {},
  };

  // Filter fields based on the template
  template.fields.forEach((field) => {
    if (metric.fields[field] !== undefined) {
      transformedMetric.fields[field] = metric.fields[field];
    }
  });

  // Filter tags based on the template
  template.tags.forEach((tag) => {
    if (metric.tags[tag] !== undefined) {
      transformedMetric.tags[tag] = metric.tags[tag];
    }
  });

  return transformedMetric;
}
