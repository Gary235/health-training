import type { DailyMealPlan, ShoppingListItem } from '../types';

export type GroupingMode = 'category' | 'day';

export function generateShoppingList(
  dailyPlans: DailyMealPlan[],
  startDate: Date,
  endDate: Date,
  groupBy: GroupingMode = 'category'
): ShoppingListItem[] {
  const ingredientMap = new Map<string, ShoppingListItem>();

  // Filter plans by date range
  const filteredPlans = dailyPlans.filter((plan) => {
    const planDate = new Date(plan.date);
    return planDate >= startDate && planDate <= endDate;
  });

  // Aggregate ingredients
  filteredPlans.forEach((dailyPlan) => {
    const dayLabel = formatDayLabel(new Date(dailyPlan.date));

    dailyPlan.meals.forEach((meal) => {
      meal.recipe.ingredients.forEach((ingredient) => {
        // When grouping by day, include day and meal in the key to prevent aggregation across days and meals
        const key = groupBy === 'day'
          ? `${ingredient.name.toLowerCase()}-${ingredient.unit}-${dayLabel}-${meal.type}`
          : `${ingredient.name.toLowerCase()}-${ingredient.unit}`;

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.amount += ingredient.amount;
        } else {
          ingredientMap.set(key, {
            ingredient: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            category: categorizeIngredient(ingredient.name),
            day: groupBy === 'day' ? dayLabel : undefined,
            meal: groupBy === 'day' ? meal.type : undefined,
            checked: false,
          });
        }
      });
    });
  });

  // Convert to array and sort
  const items = Array.from(ingredientMap.values());

  if (groupBy === 'day') {
    // Sort by day, then by meal (breakfast, lunch, dinner, snack), then by ingredient name
    const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
    items.sort((a, b) => {
      // First compare by day
      const dayComparison = (a.day || '').localeCompare(b.day || '');
      if (dayComparison !== 0) return dayComparison;

      // Then by meal
      const mealA = mealOrder[a.meal || 'breakfast'];
      const mealB = mealOrder[b.meal || 'breakfast'];
      if (mealA !== mealB) return mealA - mealB;

      // Finally by ingredient name
      return a.ingredient.localeCompare(b.ingredient);
    });
  } else {
    // Sort by category, then by ingredient name
    items.sort((a, b) => {
      if (a.category === b.category) {
        return a.ingredient.localeCompare(b.ingredient);
      }
      return (a.category || '').localeCompare(b.category || '');
    });
  }

  return items;
}

function categorizeIngredient(name: string): string {
  const nameLower = name.toLowerCase();

  if (
    nameLower.includes('chicken') ||
    nameLower.includes('beef') ||
    nameLower.includes('pork') ||
    nameLower.includes('fish') ||
    nameLower.includes('salmon') ||
    nameLower.includes('turkey') ||
    nameLower.includes('meat')
  ) {
    return 'Meat & Seafood';
  }

  if (
    nameLower.includes('milk') ||
    nameLower.includes('cheese') ||
    nameLower.includes('yogurt') ||
    nameLower.includes('butter') ||
    nameLower.includes('cream')
  ) {
    return 'Dairy';
  }

  if (
    nameLower.includes('apple') ||
    nameLower.includes('banana') ||
    nameLower.includes('orange') ||
    nameLower.includes('berry') ||
    nameLower.includes('fruit') ||
    nameLower.includes('grape') ||
    nameLower.includes('melon')
  ) {
    return 'Fruits';
  }

  if (
    nameLower.includes('lettuce') ||
    nameLower.includes('tomato') ||
    nameLower.includes('onion') ||
    nameLower.includes('carrot') ||
    nameLower.includes('pepper') ||
    nameLower.includes('broccoli') ||
    nameLower.includes('spinach') ||
    nameLower.includes('vegetable')
  ) {
    return 'Vegetables';
  }

  if (
    nameLower.includes('bread') ||
    nameLower.includes('rice') ||
    nameLower.includes('pasta') ||
    nameLower.includes('cereal') ||
    nameLower.includes('oats') ||
    nameLower.includes('flour')
  ) {
    return 'Grains & Bread';
  }

  if (
    nameLower.includes('egg')
  ) {
    return 'Eggs';
  }

  if (
    nameLower.includes('oil') ||
    nameLower.includes('vinegar') ||
    nameLower.includes('sauce') ||
    nameLower.includes('spice') ||
    nameLower.includes('salt') ||
    nameLower.includes('pepper') ||
    nameLower.includes('herb')
  ) {
    return 'Condiments & Spices';
  }

  return 'Other';
}

function formatDayLabel(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}
