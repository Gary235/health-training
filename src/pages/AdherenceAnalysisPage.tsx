import { useNavigate } from 'react-router-dom';
import { useAdaptivePlanning } from '../hooks/useAdaptivePlanning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import LoadingOverlay from '../components/common/LoadingOverlay';

export default function AdherenceAnalysisPage() {
  const navigate = useNavigate();
  const {
    analysis,
    adjusting,
    adjustMealPlan,
    adjustTrainingPlan,
    needsAdjustment,
  } = useAdaptivePlanning();

  if (!analysis) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Enough Data</CardTitle>
            <CardDescription>
              Log at least 3 days of adherence to see insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/daily')} className="w-full">
              Go to Daily Log
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAdjustMealPlan = async () => {
    try {
      await adjustMealPlan();
      toast.success('Meal plan adjusted successfully!');
      navigate('/plans/meal');
    } catch (error) {
      console.error('Failed to adjust meal plan:', error);
      toast.error('Failed to adjust meal plan. Please try again.');
    }
  };

  const handleAdjustTrainingPlan = async () => {
    try {
      await adjustTrainingPlan();
      toast.success('Training plan adjusted successfully!');
      navigate('/plans/training');
    } catch (error) {
      console.error('Failed to adjust training plan:', error);
      toast.error('Failed to adjust training plan. Please try again.');
    }
  };

  const mealPatterns = analysis.patterns.filter(p => p.type === 'meal');
  const trainingPatterns = analysis.patterns.filter(p => p.type === 'training');

  return (
    <>
      <LoadingOverlay show={adjusting} text="Adjusting your plan based on adherence patterns..." />
      <div className="min-h-screen bg-neutral-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:inline-flex">
            ← Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adherence Analysis</CardTitle>
            <CardDescription>
              Based on your last 7 days of logs ({new Date(analysis.periodStart).toLocaleDateString()} - {new Date(analysis.periodEnd).toLocaleDateString()})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-metric-lg font-tabular text-neutral-900 mb-2">{analysis.overallAdherence}%</div>
                <div className="text-sm text-neutral-600">Overall Adherence</div>
                <div className={`mt-2 text-xs ${
                  analysis.overallAdherence >= 80 ? 'text-green-600' :
                  analysis.overallAdherence >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {analysis.overallAdherence >= 80 ? 'Excellent!' :
                   analysis.overallAdherence >= 60 ? 'Good progress' :
                   'Needs improvement'}
                </div>
              </div>

              <div className="text-center">
                <div className="text-metric-lg font-tabular text-neutral-900 mb-2">{analysis.mealAdherence}%</div>
                <div className="text-sm text-neutral-600">Meal Adherence</div>
              </div>

              <div className="text-center">
                <div className="text-metric-lg font-tabular text-neutral-900 mb-2">{analysis.trainingAdherence}%</div>
                <div className="text-sm text-neutral-600">Training Adherence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {needsAdjustment && (
          <Card className="border-yellow-500 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚠️</span> Adjustment Recommended
              </CardTitle>
              <CardDescription>
                Based on your adherence patterns, we recommend adjusting your plans
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {mealPatterns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Meal Patterns</CardTitle>
              <CardDescription>Identified issues with your meal plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mealPatterns.map((pattern, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="font-semibold text-neutral-900">{pattern.itemName}</div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    {pattern.consecutiveMisses >= 3 && (
                      <p>• {pattern.consecutiveMisses} consecutive misses</p>
                    )}
                    {pattern.missRate > 0.3 && (
                      <p>• {Math.round(pattern.missRate * 100)}% miss rate</p>
                    )}
                    {pattern.commonReasons.length > 0 && (
                      <p>• Common reasons: {pattern.commonReasons.map(r => r.replace('_', ' ')).join(', ')}</p>
                    )}
                    {pattern.timingDeviations.consistent && (
                      <p>
                        • Consistently {pattern.timingDeviations.averageDelay > 0 ? 'late' : 'early'} by {Math.abs(pattern.timingDeviations.averageDelay)} minutes
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAdjustMealPlan}
                disabled={adjusting}
                className="w-full"
              >
                {adjusting ? 'Adjusting Meal Plan...' : 'Adjust Meal Plan'}
              </Button>
            </CardContent>
          </Card>
        )}

        {trainingPatterns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Training Patterns</CardTitle>
              <CardDescription>Identified issues with your training plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainingPatterns.map((pattern, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="font-semibold text-neutral-900">{pattern.itemName}</div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    {pattern.consecutiveMisses >= 3 && (
                      <p>• {pattern.consecutiveMisses} consecutive misses</p>
                    )}
                    {pattern.missRate > 0.3 && (
                      <p>• {Math.round(pattern.missRate * 100)}% miss rate</p>
                    )}
                    {pattern.commonReasons.length > 0 && (
                      <p>• Common reasons: {pattern.commonReasons.map(r => r.replace('_', ' ')).join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAdjustTrainingPlan}
                disabled={adjusting}
                className="w-full"
              >
                {adjusting ? 'Adjusting Training Plan...' : 'Adjust Training Plan'}
              </Button>
            </CardContent>
          </Card>
        )}

        {analysis.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Suggestions to improve your adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {mealPatterns.length === 0 && trainingPatterns.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Great Job! 🎉</CardTitle>
              <CardDescription>
                No significant issues detected with your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">
                Your adherence is good and no patterns suggest the need for adjustments.
                Keep up the great work!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
}
