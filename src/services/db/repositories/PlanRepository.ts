import { db } from '../database';
import type { MealPlan, TrainingPlan, PlanStatus } from '../../../types';

export class PlanRepository {
  // Meal Plans
  async getMealPlan(planId: string): Promise<MealPlan | undefined> {
    return await db.mealPlans.get(planId);
  }

  async getMealPlans(userId: string, status?: PlanStatus): Promise<MealPlan[]> {
    let query = db.mealPlans.where('userId').equals(userId);
    if (status) {
      query = query.and(plan => plan.status === status);
    }
    return await query.reverse().sortBy('createdAt');
  }

  async getActiveMealPlan(userId: string): Promise<MealPlan | undefined> {
    return await db.mealPlans
      .where('userId')
      .equals(userId)
      .and(plan => plan.status === 'active')
      .first();
  }

  async createMealPlan(plan: MealPlan): Promise<string> {
    return await db.mealPlans.add(plan);
  }

  async updateMealPlan(planId: string, updates: Partial<MealPlan>): Promise<void> {
    await db.mealPlans.update(planId, updates);
  }

  async deleteMealPlan(planId: string): Promise<void> {
    await db.mealPlans.delete(planId);
  }

  async getMealPlanForDate(userId: string, date: Date): Promise<MealPlan | undefined> {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return await db.mealPlans
      .where('userId')
      .equals(userId)
      .and(plan => {
        const start = new Date(plan.startDate);
        const end = new Date(plan.endDate);
        return dateOnly >= start && dateOnly <= end && plan.status === 'active';
      })
      .first();
  }

  // Training Plans
  async getTrainingPlan(planId: string): Promise<TrainingPlan | undefined> {
    return await db.trainingPlans.get(planId);
  }

  async getTrainingPlans(userId: string, status?: PlanStatus): Promise<TrainingPlan[]> {
    let query = db.trainingPlans.where('userId').equals(userId);
    if (status) {
      query = query.and(plan => plan.status === status);
    }
    return await query.reverse().sortBy('createdAt');
  }

  async getActiveTrainingPlan(userId: string): Promise<TrainingPlan | undefined> {
    return await db.trainingPlans
      .where('userId')
      .equals(userId)
      .and(plan => plan.status === 'active')
      .first();
  }

  async createTrainingPlan(plan: TrainingPlan): Promise<string> {
    return await db.trainingPlans.add(plan);
  }

  async updateTrainingPlan(planId: string, updates: Partial<TrainingPlan>): Promise<void> {
    await db.trainingPlans.update(planId, updates);
  }

  async deleteTrainingPlan(planId: string): Promise<void> {
    await db.trainingPlans.delete(planId);
  }

  async getTrainingPlanForDate(userId: string, date: Date): Promise<TrainingPlan | undefined> {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return await db.trainingPlans
      .where('userId')
      .equals(userId)
      .and(plan => {
        const start = new Date(plan.startDate);
        const end = new Date(plan.endDate);
        return dateOnly >= start && dateOnly <= end && plan.status === 'active';
      })
      .first();
  }
}

export const planRepository = new PlanRepository();
