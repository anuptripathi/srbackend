// metrics.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMetricsDto } from './createMetrics.dto';
import { MetricsRepository } from './metrics.repository';
import { CurrentUserDto } from '@app/common';
import { fromUnixTime, subDays, subHours, subMonths, subWeeks } from 'date-fns';
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
          host: metrics[0]?.tags.host,
        };
        const preparedDocuments = metrics.map((doc) => ({
          ...doc,
          timestamp: fromUnixTime(doc.timestamp),
          _id: new Types.ObjectId(), // Ensure each document has a unique _id
          ...userData,
        }));
        console.log('userData (createMany)', userData);
        await this.metricModel.createMany(preparedDocuments);
        console.log('metrics saved successfully', metrics);
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

  /**
   * Returns the start time based on the provided time range string.
   * Supports "1h" (1 hour), "1d" (1 day), "1w" (1 week), etc.
   * Defaults to "1h" if no valid range is provided.
   * @param timeRange - The time range string (e.g., "1h", "1d", "1w").
   * @returns A Date object representing the start of the time range.
   */
  private getStartOfTimeRange(timeRange: string): Date {
    const now = new Date();
    const regex = /^(\d+)([hdwm])$/i; // Match number followed by h, d, or w (case insensitive)
    const defaultTimeRange = '1h'; // Default time range

    // Use the provided timeRange or fallback to default
    const match = (timeRange || defaultTimeRange).toLowerCase().match(regex);

    if (!match) {
      throw new Error(
        'Invalid time range format. Expected format: "1h", "1d", "1w", etc.',
      );
    }

    const value = parseInt(match[1], 10); // Extract numeric value
    const unit = match[2]; // Extract unit (h, d, w, m)

    switch (unit) {
      case 'h':
        return subHours(now, value); // Subtract hours
      case 'd':
        return subDays(now, value); // Subtract days
      case 'w':
        return subWeeks(now, value); // Subtract weeks
      case 'm':
        return subMonths(now, value); // Subtract weeks
      default:
        throw new Error(
          'Unsupported time range unit. Use "h" for hours, "d" for days, or "w" for weeks.',
        );
    }
  }

  async getCpuUsage(timeRange: string): Promise<number> {
    try {
      const timestamp = this.getStartOfTimeRange(timeRange);
      console.log('timestamp', timestamp);
      const metrics = await this.metricModel.find({
        // timestamp: { $gte: timestamp },
        'tags.cpu': 'cpu-total',
        name: 'cpu',
      });

      if (!metrics || metrics.length === 0) {
        throw new Error(
          'No CPU metrics found for the provided host and time range',
        );
      }

      const cpuMetric = metrics[metrics.length - 1];
      const cpuUsagePercent = cpuMetric.fields['usage_system'] || 0;
      return cpuUsagePercent;
    } catch (error) {
      console.error('Error fetching CPU usage:', error);
      throw new Error('Failed to fetch CPU usage');
    }
  }

  async getRamUsage(timeRange: string): Promise<number> {
    try {
      const timestamp = this.getStartOfTimeRange(timeRange);
      console.log('timeRange', timeRange);
      const metrics = await this.metricModel.find({
        timestamp: { $gte: timestamp },
        name: 'mem',
      });

      if (!metrics || metrics.length === 0) {
        throw new Error(
          'No RAM metrics found for the provided host and time range',
        );
      }

      const ramMetric = metrics[metrics.length - 1];
      const ramUsagePercent = ramMetric.fields['used_percent'] || 0;
      return ramUsagePercent;
    } catch (error) {
      console.error('Error fetching RAM usage:', error);
      throw new Error('Failed to fetch RAM usage');
    }
  }
}
