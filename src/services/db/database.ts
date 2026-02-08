import Dexie, { type Table } from 'dexie';
import type {
  UserProfile,
  MealPlan,
  TrainingPlan,
  DailyLog,
  BodyMetrics,
  ShoppingList,
  AppSettings,
} from '../../types';

export class HealthTrainingDatabase extends Dexie {
  userProfiles!: Table<UserProfile, string>;
  mealPlans!: Table<MealPlan, string>;
  trainingPlans!: Table<TrainingPlan, string>;
  dailyLogs!: Table<DailyLog, string>;
  bodyMetrics!: Table<BodyMetrics & { id: string }, string>;
  shoppingLists!: Table<ShoppingList, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('HealthTrainingDB');

    this.version(1).stores({
      userProfiles: 'id, createdAt, updatedAt',
      mealPlans: 'id, userId, startDate, endDate, status, createdAt',
      trainingPlans: 'id, userId, startDate, endDate, status, createdAt',
      dailyLogs: 'id, userId, date, createdAt',
      bodyMetrics: 'id, date',
      shoppingLists: 'id, userId, mealPlanId, startDate, endDate, createdAt',
    });

    // Version 2: Add settings table
    this.version(2).stores({
      userProfiles: 'id, createdAt, updatedAt',
      mealPlans: 'id, userId, startDate, endDate, status, createdAt',
      trainingPlans: 'id, userId, startDate, endDate, status, createdAt',
      dailyLogs: 'id, userId, date, createdAt',
      bodyMetrics: 'id, date',
      shoppingLists: 'id, userId, mealPlanId, startDate, endDate, createdAt',
      settings: 'id',
    });

    // Version 3: Add instruction levels, recipe variations, and external sources
    this.version(3).stores({
      userProfiles: 'id, createdAt, updatedAt',
      mealPlans: 'id, userId, startDate, endDate, status, createdAt',
      trainingPlans: 'id, userId, startDate, endDate, status, createdAt',
      dailyLogs: 'id, userId, date, createdAt',
      bodyMetrics: 'id, date',
      shoppingLists: 'id, userId, mealPlanId, startDate, endDate, createdAt',
      settings: 'id',
    }).upgrade(async (tx) => {
      // Migrate existing meal plans to add new fields
      const mealPlans = await tx.table('mealPlans').toArray();

      for (const plan of mealPlans) {
        if (plan.dailyPlans) {
          plan.dailyPlans.forEach((day: any) => {
            if (day.meals) {
              day.meals.forEach((meal: any, mealIndex: number) => {
                // Set default instruction level to 'quick'
                if (!meal.currentInstructionLevel) {
                  meal.currentInstructionLevel = 'quick';
                }

                if (meal.recipe) {
                  // Set recipe instruction level
                  if (!meal.recipe.instructionLevel) {
                    meal.recipe.instructionLevel = 'quick';
                  }

                  // Generate unique recipe ID if not present
                  if (!meal.recipe.id) {
                    meal.recipe.id = `recipe-${plan.id}-${day.date}-${mealIndex}`;
                  }

                  // Set active recipe ID
                  if (!meal.activeRecipeId) {
                    meal.activeRecipeId = meal.recipe.id;
                  }
                }
              });
            }
          });
        }
      }

      // Save updated meal plans
      if (mealPlans.length > 0) {
        await tx.table('mealPlans').bulkPut(mealPlans);
      }

      console.log(`[Database Migration v3] Migrated ${mealPlans.length} meal plans with new instruction level and recipe variation fields`);
    });
  }
}

export const db = new HealthTrainingDatabase();

// Initialize database
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('[Database] Opening database...');
    await db.open();
    console.log('[Database] Database opened successfully');

    // Log database info
    console.log('[Database] Database name:', db.name);
    console.log('[Database] Database version:', db.verno);
    console.log('[Database] Tables:', db.tables.map(t => t.name).join(', '));

    // Check if database is actually working
    const count = await db.userProfiles.count();
    console.log('[Database] Current user profile count:', count);
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error);
    throw error;
  }
}

// Clear all data (useful for testing/reset)
export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });
}

// Export data (for backup/export functionality)
export async function exportData(): Promise<string> {
  const data = {
    userProfiles: await db.userProfiles.toArray(),
    mealPlans: await db.mealPlans.toArray(),
    trainingPlans: await db.trainingPlans.toArray(),
    dailyLogs: await db.dailyLogs.toArray(),
    bodyMetrics: await db.bodyMetrics.toArray(),
    shoppingLists: await db.shoppingLists.toArray(),
    settings: await db.settings.toArray(),
  };
  return JSON.stringify(data, null, 2);
}

// Import data (for restore functionality)
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    await db.transaction('rw', db.tables, async () => {
      if (data.userProfiles) await db.userProfiles.bulkPut(data.userProfiles);
      if (data.mealPlans) await db.mealPlans.bulkPut(data.mealPlans);
      if (data.trainingPlans) await db.trainingPlans.bulkPut(data.trainingPlans);
      if (data.dailyLogs) await db.dailyLogs.bulkPut(data.dailyLogs);
      if (data.bodyMetrics) await db.bodyMetrics.bulkPut(data.bodyMetrics);
      if (data.shoppingLists) await db.shoppingLists.bulkPut(data.shoppingLists);
      if (data.settings) await db.settings.bulkPut(data.settings);
    });
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
}
