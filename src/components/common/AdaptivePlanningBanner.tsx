import { useNavigate } from 'react-router-dom';
import { useAdaptivePlanning } from '../../hooks/useAdaptivePlanning';
import { TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

export default function AdaptivePlanningBanner() {
  const navigate = useNavigate();
  const { analysis, needsAdjustment } = useAdaptivePlanning();

  if (!needsAdjustment || !analysis) {
    return null;
  }

  const mealIssues = analysis.patterns.filter(p => p.type === 'meal').length;
  const trainingIssues = analysis.patterns.filter(p => p.type === 'training').length;

  return (
    <div className="bg-[rgb(254,252,232)] border border-[rgb(133,77,14)] rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-[rgb(133,77,14)] flex-shrink-0 mt-0.5" />

        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-semibold text-neutral-900">
            Plan Adjustment Available
          </h4>
          <p className="text-sm text-neutral-600">
            Analysis of your last 7 days shows patterns that may benefit from adjustment
          </p>

          <ul className="text-sm text-neutral-600 space-y-0.5 mt-2">
            <li>Overall adherence: {analysis.overallAdherence}%</li>
            {mealIssues > 0 && (
              <li>{mealIssues} meal pattern{mealIssues > 1 ? 's' : ''} identified</li>
            )}
            {trainingIssues > 0 && (
              <li>{trainingIssues} training pattern{trainingIssues > 1 ? 's' : ''} identified</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex gap-2 pl-8">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate('/adherence-analysis')}
        >
          View Analysis
        </Button>
      </div>
    </div>
  );
}
