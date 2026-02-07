import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { loadRecentLogs } from '../features/logs/logsSlice';
import { saveMealPlan, saveTrainingPlan } from '../features/plans/plansSlice';
import { analyzeAdherence } from '../utils/planAdaptation';
import { getAIService } from '../services/ai';
import type { AdherenceAnalysis } from '../types';

export function useAdaptivePlanning() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { recentLogs } = useAppSelector((state) => state.logs);
  const { activeMealPlan, activeTrainingPlan } = useAppSelector((state) => state.plans);

  const [analysis, setAnalysis] = useState<AdherenceAnalysis | null>(null);
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    if (profile) {
      dispatch(loadRecentLogs({ userId: profile.id, days: 7 }));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (recentLogs.length > 0) {
      const adherenceAnalysis = analyzeAdherence(recentLogs);
      setAnalysis(adherenceAnalysis);
    }
  }, [recentLogs]);

  const adjustMealPlan = async () => {
    if (!profile || !analysis || !activeMealPlan) {
      throw new Error('Cannot adjust plan: missing required data');
    }

    setAdjusting(true);
    try {
      const aiService = await getAIService();

      if (!aiService.isConfigured) {
        throw new Error('AI service is not configured');
      }

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const response = await aiService.generateMealPlan({
        userProfile: profile,
        startDate,
        durationDays: 7,
        adjustmentContext: {
          adherenceAnalysis: analysis,
          specificRequests: generateAdjustmentPrompt(analysis, 'meal'),
        },
      });

      // Archive old plan
      await dispatch(
        saveMealPlan({
          ...activeMealPlan,
          status: 'archived',
        })
      ).unwrap();

      // Save new adjusted plan
      await dispatch(saveMealPlan(response.plan)).unwrap();

      return response.plan;
    } finally {
      setAdjusting(false);
    }
  };

  const adjustTrainingPlan = async () => {
    if (!profile || !analysis || !activeTrainingPlan) {
      throw new Error('Cannot adjust plan: missing required data');
    }

    setAdjusting(true);
    try {
      const aiService = await getAIService();

      if (!aiService.isConfigured) {
        throw new Error('AI service is not configured');
      }

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const response = await aiService.generateTrainingPlan({
        userProfile: profile,
        startDate,
        durationWeeks: 4,
        adjustmentContext: {
          adherenceAnalysis: analysis,
          specificRequests: generateAdjustmentPrompt(analysis, 'training'),
        },
      });

      // Archive old plan
      await dispatch(
        saveTrainingPlan({
          ...activeTrainingPlan,
          status: 'archived',
        })
      ).unwrap();

      // Save new adjusted plan
      await dispatch(saveTrainingPlan(response.plan)).unwrap();

      return response.plan;
    } finally {
      setAdjusting(false);
    }
  };

  const dismissSuggestion = () => {
    // Could save this to preferences to not show again for a while
    setAnalysis(null);
  };

  return {
    analysis,
    adjusting,
    adjustMealPlan,
    adjustTrainingPlan,
    dismissSuggestion,
    needsAdjustment: analysis?.triggersAdjustment || false,
  };
}

function generateAdjustmentPrompt(analysis: AdherenceAnalysis, planType: 'meal' | 'training'): string {
  const patterns = analysis.patterns.filter(p => p.type === planType);

  if (patterns.length === 0) {
    return 'Maintain current plan structure but ensure variety and sustainability.';
  }

  const prompts: string[] = [];

  patterns.forEach(pattern => {
    if (planType === 'meal') {
      if (pattern.commonReasons.includes('time_constraint')) {
        prompts.push(
          `For ${pattern.itemName}: Use quicker recipes with prep time under 15 minutes and cook time under 20 minutes.`
        );
      }

      if (pattern.commonReasons.includes('not_hungry')) {
        prompts.push(
          `For ${pattern.itemName}: Reduce portion sizes by 20-30% or shift timing.`
        );
      }

      if (pattern.commonReasons.includes('didnt_like')) {
        prompts.push(
          `For ${pattern.itemName}: Provide more variety and alternative flavor profiles.`
        );
      }

      if (pattern.timingDeviations.consistent) {
        const direction = pattern.timingDeviations.averageDelay > 0 ? 'later' : 'earlier';
        const hours = Math.abs(Math.round(pattern.timingDeviations.averageDelay / 60));
        prompts.push(
          `For ${pattern.itemName}: Schedule ${hours} hour(s) ${direction} than previously planned.`
        );
      }
    } else if (planType === 'training') {
      if (pattern.commonReasons.includes('too_tired')) {
        prompts.push(
          `For ${pattern.itemName}: Reduce intensity by 20-30% and/or reduce session duration by 15 minutes.`
        );
      }

      if (pattern.commonReasons.includes('schedule_conflict')) {
        prompts.push(
          `For ${pattern.itemName}: Schedule on different days or different times to avoid conflicts.`
        );
      }

      if (pattern.commonReasons.includes('lack_of_motivation')) {
        prompts.push(
          `For ${pattern.itemName}: Add variety with different exercises targeting the same muscle groups.`
        );
      }

      if (pattern.commonReasons.includes('equipment_unavailable')) {
        prompts.push(
          `For ${pattern.itemName}: Use alternative bodyweight or available equipment exercises.`
        );
      }
    }
  });

  if (prompts.length === 0) {
    return 'Make minor adjustments to improve adherence while maintaining progress toward goals.';
  }

  return prompts.join(' ');
}
