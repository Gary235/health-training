import type { DailyLog, AdherenceAnalysis, AdherencePattern, DeviationReason } from '../types';

export function analyzeAdherence(logs: DailyLog[]): AdherenceAnalysis {
  if (logs.length === 0) {
    return {
      periodStart: new Date(),
      periodEnd: new Date(),
      overallAdherence: 0,
      mealAdherence: 0,
      trainingAdherence: 0,
      patterns: [],
      recommendations: [],
      triggersAdjustment: false,
    };
  }

  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const periodStart = new Date(sortedLogs[0].date);
  const periodEnd = new Date(sortedLogs[sortedLogs.length - 1].date);

  // Calculate overall adherence
  const totalAdherence = sortedLogs.reduce((sum, log) => sum + log.overallAdherence, 0);
  const overallAdherence = Math.round(totalAdherence / sortedLogs.length);

  // Calculate meal adherence
  let mealCompletedCount = 0;
  let mealTotalCount = 0;
  sortedLogs.forEach(log => {
    log.mealLogs.forEach(meal => {
      mealTotalCount++;
      if (meal.adherence === 'full') mealCompletedCount += 1;
      else if (meal.adherence === 'partial') mealCompletedCount += 0.5;
    });
  });
  const mealAdherence = mealTotalCount > 0
    ? Math.round((mealCompletedCount / mealTotalCount) * 100)
    : 0;

  // Calculate training adherence
  let trainingCompletedCount = 0;
  let trainingTotalCount = 0;
  sortedLogs.forEach(log => {
    log.trainingLogs.forEach(training => {
      trainingTotalCount++;
      if (training.adherence === 'full') trainingCompletedCount += 1;
      else if (training.adherence === 'partial') trainingCompletedCount += 0.5;
    });
  });
  const trainingAdherence = trainingTotalCount > 0
    ? Math.round((trainingCompletedCount / trainingTotalCount) * 100)
    : 0;

  // Identify patterns
  const patterns: AdherencePattern[] = [];

  // Analyze meal patterns
  const mealPatterns = analyzeMealPatterns(sortedLogs);
  patterns.push(...mealPatterns);

  // Analyze training patterns
  const trainingPatterns = analyzeTrainingPatterns(sortedLogs);
  patterns.push(...trainingPatterns);

  // Generate recommendations
  const recommendations = generateRecommendations(patterns, mealAdherence, trainingAdherence);

  // Determine if adjustment is needed
  const triggersAdjustment = shouldTriggerAdjustment(patterns, overallAdherence);

  return {
    periodStart,
    periodEnd,
    overallAdherence,
    mealAdherence,
    trainingAdherence,
    patterns,
    recommendations,
    triggersAdjustment,
  };
}

function analyzeMealPatterns(logs: DailyLog[]): AdherencePattern[] {
  const patterns: AdherencePattern[] = [];
  const mealTypeTracking: {
    [mealType: string]: {
      misses: number[];
      reasons: DeviationReason[];
      timingDelays: number[];
    };
  } = {};

  logs.forEach((log, logIndex) => {
    log.mealLogs.forEach(meal => {
      if (!mealTypeTracking[meal.mealType]) {
        mealTypeTracking[meal.mealType] = {
          misses: [],
          reasons: [],
          timingDelays: [],
        };
      }

      // Track misses
      if (meal.adherence === 'skipped') {
        mealTypeTracking[meal.mealType].misses.push(logIndex);
      }

      // Track deviation reasons
      if (meal.deviations) {
        meal.deviations.forEach(dev => {
          mealTypeTracking[meal.mealType].reasons.push(dev.reason);
        });
      }

      // Track timing delays
      if (meal.scheduledTime && meal.actualTime) {
        const scheduled = parseTime(meal.scheduledTime);
        const actual = parseTime(meal.actualTime);
        const delay = actual - scheduled;
        mealTypeTracking[meal.mealType].timingDelays.push(delay);
      }
    });
  });

  // Identify patterns
  Object.entries(mealTypeTracking).forEach(([mealType, data]) => {
    const totalMeals = logs.length;
    const missRate = data.misses.length / totalMeals;

    // Check for consecutive misses
    const consecutiveMisses = findMaxConsecutive(data.misses);

    // Check for timing consistency
    const avgDelay = data.timingDelays.length > 0
      ? data.timingDelays.reduce((a, b) => a + b, 0) / data.timingDelays.length
      : 0;

    const consistentTiming = data.timingDelays.length >= 3 &&
      Math.abs(avgDelay) > 30 && // More than 30 minutes delay
      data.timingDelays.every(d => Math.abs(d - avgDelay) < 30); // Consistent within 30 min

    // Get most common reasons
    const reasonCounts = countOccurrences(data.reasons);
    const commonReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason]) => reason as DeviationReason);

    if (consecutiveMisses >= 3 || missRate > 0.5) {
      patterns.push({
        type: 'meal',
        itemName: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
        consecutiveMisses,
        missRate,
        commonReasons,
        timingDeviations: {
          averageDelay: Math.round(avgDelay),
          consistent: consistentTiming,
        },
      });
    } else if (consistentTiming) {
      patterns.push({
        type: 'meal',
        itemName: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
        consecutiveMisses,
        missRate,
        commonReasons,
        timingDeviations: {
          averageDelay: Math.round(avgDelay),
          consistent: true,
        },
      });
    }
  });

  return patterns;
}

function analyzeTrainingPatterns(logs: DailyLog[]): AdherencePattern[] {
  const patterns: AdherencePattern[] = [];
  const sessionTracking: {
    [sessionName: string]: {
      misses: number[];
      reasons: DeviationReason[];
    };
  } = {};

  logs.forEach((log, logIndex) => {
    log.trainingLogs.forEach(training => {
      if (!sessionTracking[training.sessionName]) {
        sessionTracking[training.sessionName] = {
          misses: [],
          reasons: [],
        };
      }

      // Track misses
      if (training.adherence === 'skipped') {
        sessionTracking[training.sessionName].misses.push(logIndex);
      }

      // Track deviation reasons
      if (training.deviations) {
        training.deviations.forEach(dev => {
          sessionTracking[training.sessionName].reasons.push(dev.reason);
        });
      }
    });
  });

  // Identify patterns
  Object.entries(sessionTracking).forEach(([sessionName, data]) => {
    const totalSessions = logs.length;
    const missRate = data.misses.length / totalSessions;
    const consecutiveMisses = findMaxConsecutive(data.misses);

    // Get most common reasons
    const reasonCounts = countOccurrences(data.reasons);
    const commonReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason]) => reason as DeviationReason);

    if (consecutiveMisses >= 3 || missRate > 0.5) {
      patterns.push({
        type: 'training',
        itemName: sessionName,
        consecutiveMisses,
        missRate,
        commonReasons,
        timingDeviations: {
          averageDelay: 0,
          consistent: false,
        },
      });
    }
  });

  return patterns;
}

function generateRecommendations(
  patterns: AdherencePattern[],
  mealAdherence: number,
  trainingAdherence: number
): string[] {
  const recommendations: string[] = [];

  patterns.forEach(pattern => {
    if (pattern.type === 'meal') {
      if (pattern.consecutiveMisses >= 3) {
        if (pattern.commonReasons.includes('time_constraint')) {
          recommendations.push(
            `Consider simpler meals for ${pattern.itemName} with shorter prep time`
          );
        } else if (pattern.commonReasons.includes('not_hungry')) {
          recommendations.push(
            `Adjust ${pattern.itemName} timing or reduce portion size`
          );
        } else if (pattern.commonReasons.includes('didnt_like')) {
          recommendations.push(
            `Explore alternative recipes for ${pattern.itemName}`
          );
        }
      }

      if (pattern.timingDeviations.consistent && Math.abs(pattern.timingDeviations.averageDelay) > 30) {
        const direction = pattern.timingDeviations.averageDelay > 0 ? 'later' : 'earlier';
        const hours = Math.abs(Math.round(pattern.timingDeviations.averageDelay / 60));
        recommendations.push(
          `Shift ${pattern.itemName} ${hours} hour(s) ${direction} to match your actual schedule`
        );
      }
    } else if (pattern.type === 'training') {
      if (pattern.consecutiveMisses >= 3) {
        if (pattern.commonReasons.includes('too_tired')) {
          recommendations.push(
            `Reduce intensity or duration of ${pattern.itemName} sessions`
          );
        } else if (pattern.commonReasons.includes('schedule_conflict')) {
          recommendations.push(
            `Reschedule ${pattern.itemName} to a different time or day`
          );
        } else if (pattern.commonReasons.includes('lack_of_motivation')) {
          recommendations.push(
            `Add variety to ${pattern.itemName} or try different exercises`
          );
        }
      }
    }
  });

  // General recommendations based on adherence
  if (mealAdherence < 60) {
    recommendations.push('Consider simplifying your meal plan with easier recipes');
  }

  if (trainingAdherence < 60) {
    recommendations.push('Consider reducing workout frequency or intensity');
  }

  return recommendations;
}

function shouldTriggerAdjustment(patterns: AdherencePattern[], overallAdherence: number): boolean {
  // Trigger if any pattern shows 3+ consecutive misses
  if (patterns.some(p => p.consecutiveMisses >= 3)) {
    return true;
  }

  // Trigger if overall adherence is below 60%
  if (overallAdherence < 60) {
    return true;
  }

  // Trigger if there's a consistent timing deviation
  if (patterns.some(p => p.timingDeviations.consistent && Math.abs(p.timingDeviations.averageDelay) > 60)) {
    return true;
  }

  return false;
}

// Helper functions
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function findMaxConsecutive(indices: number[]): number {
  if (indices.length === 0) return 0;

  const sorted = [...indices].sort((a, b) => a - b);
  let maxConsecutive = 1;
  let currentConsecutive = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 1;
    }
  }

  return maxConsecutive;
}

function countOccurrences<T>(items: T[]): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach(item => {
    const key = String(item);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}
