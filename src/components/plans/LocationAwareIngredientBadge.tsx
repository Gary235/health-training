import { useState } from 'react';
import type { Region } from '../../types/user.types';
import { regionalContextService } from '../../services/external/regionalContextService';

interface LocationAwareIngredientBadgeProps {
  ingredient: string;
  userRegion: Region;
}

export default function LocationAwareIngredientBadge({
  ingredient,
  userRegion,
}: LocationAwareIngredientBadgeProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  const isCommon = regionalContextService.isIngredientCommon(ingredient, userRegion);
  const alternatives = regionalContextService.findIngredientAlternatives(ingredient, userRegion);

  // If ingredient is common, show normal badge
  if (isCommon) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-neutral-100 text-neutral-700">
        {ingredient}
      </span>
    );
  }

  // If ingredient is uncommon, show warning badge with alternatives
  return (
    <div className="inline-block relative">
      <button
        type="button"
        onClick={() => setShowAlternatives(!showAlternatives)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
        title="This ingredient may be less common in your region"
      >
        <span>⚠️</span>
        <span>{ingredient}</span>
        {alternatives.length > 0 && <span className="text-amber-600">ℹ️</span>}
      </button>

      {/* Alternatives Tooltip */}
      {showAlternatives && alternatives.length > 0 && (
        <div className="absolute z-10 mt-1 p-3 bg-white border border-neutral-200 rounded-lg shadow-lg min-w-[200px]">
          <div className="text-xs font-medium text-neutral-700 mb-2">
            Local alternatives:
          </div>
          <div className="space-y-1">
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className="text-xs text-neutral-600 flex items-center gap-1"
              >
                <span className="text-green-600">✓</span>
                <span>{alt}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-neutral-500 mt-2 pt-2 border-t">
            These are more common in your region
          </div>
        </div>
      )}
    </div>
  );
}
