import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { generateShoppingList, type GroupingMode } from '../utils/shoppingListGenerator';
import type { ShoppingListItem } from '../types';

export default function ShoppingListPage() {
  const navigate = useNavigate();
  const { activeMealPlan } = useAppSelector((state) => state.plans);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<{ [category: string]: ShoppingListItem[] }>({});
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('day');

  useEffect(() => {
    if (activeMealPlan) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7); // 7 days ahead

      const shoppingList = generateShoppingList(
        activeMealPlan.dailyPlans,
        startDate,
        endDate,
        groupingMode
      );

      setItems(shoppingList);

      // Group by category or day based on grouping mode
      const grouped: { [key: string]: ShoppingListItem[] } = {};
      shoppingList.forEach((item) => {
        const groupKey = groupingMode === 'day' ? (item.day || 'Unknown') : (item.category || 'Other');
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(item);
      });
      setGroupedItems(grouped);
    }
  }, [activeMealPlan, groupingMode]);

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);

    // Update grouped items based on grouping mode
    const grouped: { [key: string]: ShoppingListItem[] } = {};
    newItems.forEach((item) => {
      const groupKey = groupingMode === 'day' ? (item.day || 'Unknown') : (item.category || 'Other');
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(item);
    });
    setGroupedItems(grouped);
  };

  // Helper function to group items by meal within a day
  const groupByMeal = (dayItems: ShoppingListItem[]) => {
    const mealGroups: { [meal: string]: ShoppingListItem[] } = {};
    dayItems.forEach((item) => {
      const mealKey = item.meal ? item.meal.charAt(0).toUpperCase() + item.meal.slice(1) : 'Other';
      if (!mealGroups[mealKey]) {
        mealGroups[mealKey] = [];
      }
      mealGroups[mealKey].push(item);
    });
    return mealGroups;
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const progressPercent = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  // Create a map of day labels to dates for proper date sorting
  const dayLabelToDate = new Map<string, Date>();
  if (activeMealPlan) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    activeMealPlan.dailyPlans
      .filter((plan) => {
        const planDate = new Date(plan.date);
        return planDate >= startDate && planDate <= endDate;
      })
      .forEach((plan) => {
        const date = new Date(plan.date);
        const label = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });
        dayLabelToDate.set(label, date);
      });
  }

  // Sort grouped items entries by date when in day mode
  const sortedGroupEntries = Object.entries(groupedItems).sort(([keyA], [keyB]) => {
    if (groupingMode === 'day') {
      const dateA = dayLabelToDate.get(keyA);
      const dateB = dayLabelToDate.get(keyB);
      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      }
    }
    return keyA.localeCompare(keyB);
  });

  if (!activeMealPlan) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Active Meal Plan</CardTitle>
            <CardDescription>Generate a meal plan first to create a shopping list</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/plans/meal/generate')} className="w-full">
              Generate Meal Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate('/daily')} className="hidden md:inline-flex">
            ← Back to Daily View
          </Button>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={groupingMode === 'category' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setGroupingMode('category')}
            >
              By Category
            </Button>
            <Button
              variant={groupingMode === 'day' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setGroupingMode('day')}
            >
              By Day
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const text = items
                  .map((item) => `${item.checked ? '☑' : '☐'} ${item.ingredient}: ${item.amount} ${item.unit}`)
                  .join('\n');
                navigator.clipboard.writeText(text);
                alert('Shopping list copied to clipboard!');
              }}
            >
              Copy List
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shopping List</CardTitle>
            <CardDescription>
              For next 7 days • {items.length} items • Grouped by {groupingMode === 'day' ? 'Day' : 'Category'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-neutral-700">
                <span>Progress</span>
                <span className="font-semibold font-tabular">
                  {checkedCount} / {items.length} items
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sortedGroupEntries.map(([groupKey, groupItems]) => (
            <Card key={groupKey}>
              <CardHeader>
                <CardTitle className="text-md">{groupKey}</CardTitle>
                <CardDescription>
                  {groupItems.length} items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupingMode === 'day' ? (
                  // When grouping by day, show meal subgroups
                  <div className="space-y-4">
                    {Object.entries(groupByMeal(groupItems)).map(([mealKey, mealItems]) => (
                      <div key={mealKey}>
                        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
                          {mealKey}
                        </h3>
                        <div className="space-y-2">
                          {mealItems.map((item) => {
                            const globalIndex = items.findIndex(
                              (i) => i.ingredient === item.ingredient && i.unit === item.unit &&
                              i.day === item.day && i.meal === item.meal
                            );
                            return (
                              <div
                                key={`${item.ingredient}-${item.unit}-${item.day || ''}-${item.meal || ''}`}
                                className="flex items-center gap-3 p-2 rounded hover:bg-neutral-100 cursor-pointer"
                                onClick={() => toggleItem(globalIndex)}
                              >
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  onChange={() => toggleItem(globalIndex)}
                                  className="w-5 h-5 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <span className={item.checked ? 'line-through text-neutral-600' : 'text-neutral-900'}>
                                    {item.ingredient}
                                  </span>
                                </div>
                                <div className="text-sm text-neutral-600 font-tabular">
                                  {item.amount} {item.unit}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // When grouping by category, show items normally
                  <div className="space-y-2">
                    {groupItems.map((item) => {
                      const globalIndex = items.findIndex(
                        (i) => i.ingredient === item.ingredient && i.unit === item.unit
                      );
                      return (
                        <div
                          key={`${item.ingredient}-${item.unit}`}
                          className="flex items-center gap-3 p-2 rounded hover:bg-neutral-100 cursor-pointer"
                          onClick={() => toggleItem(globalIndex)}
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(globalIndex)}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className={item.checked ? 'line-through text-neutral-600' : 'text-neutral-900'}>
                              {item.ingredient}
                            </span>
                          </div>
                          <div className="text-sm text-neutral-600 font-tabular">
                            {item.amount} {item.unit}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
