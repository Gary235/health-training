import type { Region } from '../../types/user.types';
import type { Ingredient } from '../../types/plan.types';
import { regionalContextService } from '../../services/external/regionalContextService';

interface RegionalIngredientGuideProps {
  ingredients: Ingredient[];
  userRegion: Region;
}

export default function RegionalIngredientGuide({
  ingredients,
  userRegion,
}: RegionalIngredientGuideProps) {
  const ingredientNames = ingredients.map((ing) => ing.name);
  const analysis = regionalContextService.analyzeRecipeForRegion(ingredientNames, userRegion);

  // If all ingredients are common, don't show the guide
  if (analysis.uncommonIngredients.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">🌍</span>
        <div className="flex-1">
          <h4 className="font-medium text-sm text-amber-900 mb-1">
            Regional Ingredient Notes
          </h4>
          <p className="text-xs text-amber-800 mb-3">
            Some ingredients in this recipe may be less common in your region. Here are local alternatives you can use:
          </p>

          <div className="space-y-2">
            {analysis.uncommonIngredients.map((ingredient) => {
              const alternatives = analysis.suggestedAlternatives[ingredient];
              if (!alternatives || alternatives.length === 0) return null;

              return (
                <div key={ingredient} className="text-xs">
                  <div className="font-medium text-amber-900 mb-1">
                    <span className="text-amber-600">⚠️</span> {ingredient}
                  </div>
                  <div className="ml-4 flex flex-wrap gap-2">
                    {alternatives.map((alt, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-amber-200 rounded text-amber-800"
                      >
                        <span className="text-green-600">→</span>
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="text-xs text-amber-700">
              💡 <span className="font-medium">Tip:</span> These alternatives are commonly available in{' '}
              {userRegion.replace('_', ' ')} and will work similarly in this recipe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
