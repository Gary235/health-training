import { db } from '../database';
import type { DailyLog, BodyMetrics } from '../../../types';

export class LogRepository {
  // Daily Logs
  async getDailyLog(logId: string): Promise<DailyLog | undefined> {
    return await db.dailyLogs.get(logId);
  }

  async getDailyLogByDate(userId: string, date: Date): Promise<DailyLog | undefined> {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return await db.dailyLogs
      .where('userId')
      .equals(userId)
      .and(log => {
        const logDate = new Date(log.date);
        return (
          logDate.getFullYear() === dateOnly.getFullYear() &&
          logDate.getMonth() === dateOnly.getMonth() &&
          logDate.getDate() === dateOnly.getDate()
        );
      })
      .first();
  }

  async getDailyLogs(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<DailyLog[]> {
    let query = db.dailyLogs.where('userId').equals(userId);

    if (startDate || endDate) {
      query = query.and(log => {
        const logDate = new Date(log.date);
        if (startDate && endDate) {
          return logDate >= startDate && logDate <= endDate;
        } else if (startDate) {
          return logDate >= startDate;
        } else if (endDate) {
          return logDate <= endDate;
        }
        return true;
      });
    }

    return await query.reverse().sortBy('date');
  }

  async getRecentLogs(userId: string, days: number = 7): Promise<DailyLog[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return await this.getDailyLogs(userId, startDate, endDate);
  }

  async createDailyLog(log: DailyLog): Promise<string> {
    return await db.dailyLogs.add(log);
  }

  async updateDailyLog(logId: string, updates: Partial<DailyLog>): Promise<void> {
    await db.dailyLogs.update(logId, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteDailyLog(logId: string): Promise<void> {
    await db.dailyLogs.delete(logId);
  }

  // Body Metrics
  async getBodyMetrics(date: Date): Promise<BodyMetrics | undefined> {
    const dateStr = date.toISOString().split('T')[0];
    return await db.bodyMetrics
      .where('date')
      .equals(dateStr as any)
      .first() as any;
  }

  async getBodyMetricsHistory(
    startDate?: Date,
    endDate?: Date
  ): Promise<BodyMetrics[]> {
    let query = db.bodyMetrics.toCollection();

    if (startDate || endDate) {
      query = query.and(metrics => {
        const metricsDate = new Date(metrics.date);
        if (startDate && endDate) {
          return metricsDate >= startDate && metricsDate <= endDate;
        } else if (startDate) {
          return metricsDate >= startDate;
        } else if (endDate) {
          return metricsDate <= endDate;
        }
        return true;
      });
    }

    return await query.reverse().sortBy('date');
  }

  async saveBodyMetrics(metrics: BodyMetrics): Promise<string> {
    const id = `metrics-${metrics.date.toISOString()}`;
    await db.bodyMetrics.put({ ...metrics, id } as any);
    return id;
  }

  async deleteBodyMetrics(id: string): Promise<void> {
    await db.bodyMetrics.delete(id);
  }
}

export const logRepository = new LogRepository();
