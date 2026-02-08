import type { CookingMethod, CookingPreferenceLevel } from '../../types/user.types';

interface CookingMethodPreferenceRowProps {
  method: CookingMethod;
  preference: CookingPreferenceLevel;
  onChange: (method: CookingMethod, level: CookingPreferenceLevel) => void;
}

const COOKING_METHOD_LABELS: Record<CookingMethod, string> = {
  baking: 'Baking',
  frying: 'Frying',
  grilling: 'Grilling',
  boiling: 'Boiling',
  steaming: 'Steaming',
  roasting: 'Roasting',
  sauteing: 'Sautéing',
  slow_cooking: 'Slow Cooking',
  pressure_cooking: 'Pressure Cooking',
  raw: 'Raw/No Heat',
  no_cook: 'No Cook',
};

const COOKING_METHOD_DESCRIPTIONS: Record<CookingMethod, string> = {
  baking: 'Oven-baked dishes like casseroles, bread, cakes',
  frying: 'Pan-fried or deep-fried foods',
  grilling: 'Grilled meats, vegetables, sandwiches',
  boiling: 'Boiled vegetables, pasta, soups',
  steaming: 'Steamed vegetables, dumplings, fish',
  roasting: 'Roasted meats, vegetables in the oven',
  sauteing: 'Quick cooking in a pan with oil',
  slow_cooking: 'Slow cooker or crockpot meals',
  pressure_cooking: 'Instant pot or pressure cooker dishes',
  raw: 'Salads, raw vegetables, uncooked foods',
  no_cook: 'Assembled meals without cooking',
};

const PREFERENCE_LEVELS: Array<{ value: CookingPreferenceLevel; label: string; color: string }> = [
  { value: 'avoid', label: 'Avoid', color: 'bg-red-500' },
  { value: 'less', label: 'Less', color: 'bg-orange-500' },
  { value: 'normal', label: 'Normal', color: 'bg-gray-500' },
  { value: 'more', label: 'More', color: 'bg-blue-500' },
  { value: 'prefer', label: 'Prefer', color: 'bg-green-500' },
];

export default function CookingMethodPreferenceRow({
  method,
  preference,
  onChange,
}: CookingMethodPreferenceRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-border last:border-b-0 hover:bg-neutral-100/50 transition-colors">
      <div className="flex-1 mb-3 sm:mb-0 sm:pr-4">
        <div className="font-medium text-sm mb-1 text-neutral-800">{COOKING_METHOD_LABELS[method]}</div>
        <div className="text-xs text-neutral-600 leading-relaxed">
          {COOKING_METHOD_DESCRIPTIONS[method]}
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap sm:flex-nowrap">
        {PREFERENCE_LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(method, level.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              preference === level.value
                ? `${level.color} text-white shadow-sm`
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            title={level.label}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
