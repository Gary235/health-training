import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadMetrics, saveMetrics } from '../features/metrics/metricsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import type { BodyMetrics } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

export default function MetricsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { metrics } = useAppSelector((state) => state.metrics);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<BodyMetrics>>({
    date: new Date(),
    weight: undefined,
    bodyFat: undefined,
    measurements: {},
  });

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // Last 90 days
    dispatch(loadMetrics({ startDate, endDate }));
  }, [dispatch]);

  const handleSave = async () => {
    if (!formData.weight && !formData.bodyFat && !Object.keys(formData.measurements || {}).length) {
      alert('Please enter at least one measurement');
      return;
    }

    const metricsToSave: BodyMetrics = {
      date: formData.date || new Date(),
      weight: formData.weight,
      bodyFat: formData.bodyFat,
      measurements: formData.measurements,
      notes: formData.notes,
    };

    await dispatch(saveMetrics(metricsToSave)).unwrap();
    toast.success('Body metrics saved successfully!');
    setShowForm(false);
    setFormData({
      date: new Date(),
      weight: undefined,
      bodyFat: undefined,
      measurements: {},
    });
  };

  const chartData = metrics
    .map((m: BodyMetrics) => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: m.weight || null,
      bodyFat: m.bodyFat || null,
    }))
    .reverse();

  const measurementSystem = profile?.bodySpecs.measurementSystem || 'metric';
  const weightUnit = measurementSystem === 'metric' ? 'kg' : 'lbs';

  const latestMetrics = metrics.length > 0 ? metrics[0] : null;

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="hidden md:inline-flex">
            ← Back to Dashboard
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="md:ml-auto">
            {showForm ? 'Cancel' : '+ Add Metrics'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Record Body Metrics</CardTitle>
              <CardDescription>Track your progress over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date?.toISOString().split('T')[0] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, date: new Date(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight ({weightUnit})</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })
                    }
                    placeholder={`Enter weight in ${weightUnit}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat %</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    value={formData.bodyFat || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyFat: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="e.g., 15.5"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-neutral-900">Body Measurements (cm)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['chest', 'waist', 'hips', 'thighs', 'arms', 'neck'].map((measurement) => (
                    <div key={measurement} className="space-y-2">
                      <Label htmlFor={measurement} className="capitalize">
                        {measurement}
                      </Label>
                      <Input
                        id={measurement}
                        type="number"
                        step="0.1"
                        value={formData.measurements?.[measurement as keyof typeof formData.measurements] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            measurements: {
                              ...formData.measurements,
                              [measurement]: parseFloat(e.target.value) || undefined,
                            },
                          })
                        }
                        placeholder="cm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How are you feeling? Any observations?"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Metrics
              </Button>
            </CardContent>
          </Card>
        )}

        {latestMetrics && (
          <Card>
            <CardHeader>
              <CardTitle>Current Stats</CardTitle>
              <CardDescription>
                Last recorded on {new Date(latestMetrics.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {latestMetrics.weight && (
                  <div className="text-center">
                    <div className="text-metric-lg font-tabular text-neutral-900">{latestMetrics.weight}</div>
                    <div className="text-sm text-neutral-600">{weightUnit}</div>
                  </div>
                )}
                {latestMetrics.bodyFat && (
                  <div className="text-center">
                    <div className="text-metric-lg font-tabular text-neutral-900">{latestMetrics.bodyFat}%</div>
                    <div className="text-sm text-neutral-600">Body Fat</div>
                  </div>
                )}
                {latestMetrics.measurements?.chest && (
                  <div className="text-center">
                    <div className="text-metric-lg font-tabular text-neutral-900">{latestMetrics.measurements.chest}</div>
                    <div className="text-sm text-neutral-600">Chest (cm)</div>
                  </div>
                )}
                {latestMetrics.measurements?.waist && (
                  <div className="text-center">
                    <div className="text-metric-lg font-tabular text-neutral-900">{latestMetrics.measurements.waist}</div>
                    <div className="text-sm text-neutral-600">Waist (cm)</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {chartData.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Last 90 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name={`Weight (${weightUnit})`}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {chartData.some((d: { date: string; weight: number | null; bodyFat: number | null }) => d.bodyFat !== null) && (
              <Card>
                <CardHeader>
                  <CardTitle>Body Fat Progress</CardTitle>
                  <CardDescription>Last 90 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bodyFat"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Body Fat %"
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {metrics.length === 0 && !showForm && (
          <Card>
            <CardHeader>
              <CardTitle>No Metrics Yet</CardTitle>
              <CardDescription>Start tracking your body metrics to see progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowForm(true)} className="w-full">
                Add Your First Metrics
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
