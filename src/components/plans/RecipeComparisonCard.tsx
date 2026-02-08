import type { Recipe } from '../../types/plan.types';
import { Badge } from '../ui/badge';

interface RecipeComparisonCardProps {
  recipe: Recipe;
  isSelected: boolean;
  onSelect: () => void;
}

export default function RecipeComparisonCard({
  recipe,
  isSelected,
  onSelect,
}: RecipeComparisonCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-neutral-900 bg-neutral-50 shadow-md'
          : 'border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-800">{recipe.name}</h4>
          {recipe.variantNotes && (
            <p className="text-xs text-blue-600 mt-1">{recipe.variantNotes}</p>
          )}
        </div>
        {isSelected && (
          <Badge variant="default" className="ml-2">
            Selected
          </Badge>
        )}
      </div>

      <p className="text-sm text-neutral-600 mb-3">{recipe.description}</p>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-neutral-100 rounded">
        <div className="text-center">
          <div className="text-xs text-neutral-600">Calories</div>
          <div className="font-semibold text-sm text-neutral-800">{recipe.nutrition.calories}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-600">Protein</div>
          <div className="font-semibold text-sm text-neutral-800">{recipe.nutrition.protein}g</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-600">Carbs</div>
          <div className="font-semibold text-sm text-neutral-800">{recipe.nutrition.carbohydrates}g</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-600">Fat</div>
          <div className="font-semibold text-sm text-neutral-800">{recipe.nutrition.fat}g</div>
        </div>
      </div>

      {/* Time Info */}
      <div className="flex gap-4 text-xs text-neutral-600">
        <span>⏱️ Prep: {recipe.prepTime}min</span>
        <span>🔥 Cook: {recipe.cookTime}min</span>
        {recipe.primaryCookingMethod && (
          <span>👨‍🍳 {recipe.primaryCookingMethod.replace('_', ' ')}</span>
        )}
      </div>
    </div>
  );
}
