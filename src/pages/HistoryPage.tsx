import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { loadLogs } from '../features/logs/logsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import type { DailyLog } from '../types';

export default function HistoryPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { logs } = useAppSelector((state) => state.logs);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    if (profile) {
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);
      dispatch(loadLogs({ userId: profile.id, startDate, endDate }));
    }
  }, [dispatch, profile, selectedMonth, selectedYear]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  const getLogForDate = (day: number): DailyLog | undefined => {
    const date = new Date(selectedYear, selectedMonth, day);
    return logs.find((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getFullYear() === date.getFullYear() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getDate() === date.getDate()
      );
    });
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 80) return 'bg-green-500';
    if (adherence >= 60) return 'bg-yellow-500';
    if (adherence >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const monthStats = {
    totalDays: logs.length,
    avgAdherence: logs.length > 0
      ? Math.round(logs.reduce((sum, log) => sum + log.overallAdherence, 0) / logs.length)
      : 0,
    perfectDays: logs.filter((log) => log.overallAdherence === 100).length,
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>View your adherence history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={selectedMonth.toString()}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={selectedYear.toString()}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-metric-lg font-tabular text-neutral-900">{monthStats.totalDays}</div>
                <div className="text-sm text-neutral-600">Days Logged</div>
              </div>
              <div>
                <div className="text-metric-lg font-tabular text-neutral-900">{monthStats.avgAdherence}%</div>
                <div className="text-sm text-neutral-600">Avg Adherence</div>
              </div>
              <div>
                <div className="text-metric-lg font-tabular text-neutral-900">{monthStats.perfectDays}</div>
                <div className="text-sm text-neutral-600">Perfect Days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Click a day to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-semibold text-sm py-2 text-neutral-700">
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const log = getLogForDate(day);
                const today = new Date();
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === selectedMonth &&
                  today.getFullYear() === selectedYear;

                return (
                  <button
                    key={day}
                    onClick={() => log && setSelectedLog(log)}
                    className={`
                      aspect-square p-2 rounded-lg text-sm border border-neutral-200
                      ${log ? 'cursor-pointer hover:ring-2 hover:ring-primary' : 'cursor-default'}
                      ${isToday ? 'ring-2 ring-primary' : ''}
                      ${log ? 'bg-neutral-100' : 'bg-neutral-50'}
                      relative
                    `}
                  >
                    <div className="font-semibold text-neutral-700">{day}</div>
                    {log && (
                      <div
                        className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full ${getAdherenceColor(
                          log.overallAdherence
                        )}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4 text-xs text-neutral-600 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>≥80%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>60-79%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>40-59%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>&lt;40%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedLog && (
          <Card>
            <CardHeader>
              <CardTitle>
                {new Date(selectedLog.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
              <CardDescription>Daily log details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-metric-lg font-tabular text-neutral-900">{selectedLog.overallAdherence}%</div>
                <div className="text-sm text-neutral-600">Overall Adherence</div>
              </div>

              {selectedLog.mealLogs.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-neutral-800">Meals</h4>
                  <div className="space-y-2">
                    {selectedLog.mealLogs.map((meal, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          meal.adherence === 'full'
                            ? 'bg-green-500/10'
                            : meal.adherence === 'partial'
                            ? 'bg-yellow-500/10'
                            : 'bg-red-500/10'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="capitalize">{meal.mealType}</span>
                          <span className="capitalize">{meal.adherence}</span>
                        </div>
                        {meal.deviations && meal.deviations.length > 0 && (
                          <div className="text-xs text-neutral-600 mt-1">
                            Reason: {meal.deviations[0].reason.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.trainingLogs.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-neutral-800">Training</h4>
                  <div className="space-y-2">
                    {selectedLog.trainingLogs.map((training, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          training.adherence === 'full'
                            ? 'bg-green-500/10'
                            : training.adherence === 'partial'
                            ? 'bg-yellow-500/10'
                            : 'bg-red-500/10'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{training.sessionName}</span>
                          <span className="capitalize">{training.adherence}</span>
                        </div>
                        {training.perceivedExertion && (
                          <div className="text-xs text-neutral-600 mt-1">
                            Exertion: {training.perceivedExertion}/10
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.generalNotes && (
                <div>
                  <h4 className="font-semibold mb-2 text-neutral-800">Notes</h4>
                  <p className="text-sm text-neutral-600">{selectedLog.generalNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
