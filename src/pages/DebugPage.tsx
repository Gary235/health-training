import { useEffect, useState } from 'react';
import { db } from '../services/db/database';
import type { UserProfile } from '../types';

export default function DebugPage() {
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDbData = async () => {
      try {
        console.log('Loading data from IndexedDB...');

        const userProfiles = await db.userProfiles.toArray();
        const mealPlans = await db.mealPlans.toArray();
        const trainingPlans = await db.trainingPlans.toArray();
        const dailyLogs = await db.dailyLogs.toArray();
        const bodyMetrics = await db.bodyMetrics.toArray();
        const shoppingLists = await db.shoppingLists.toArray();

        const data = {
          userProfiles,
          mealPlans,
          trainingPlans,
          dailyLogs,
          bodyMetrics,
          shoppingLists,
          counts: {
            userProfiles: userProfiles.length,
            mealPlans: mealPlans.length,
            trainingPlans: trainingPlans.length,
            dailyLogs: dailyLogs.length,
            bodyMetrics: bodyMetrics.length,
            shoppingLists: shoppingLists.length,
          }
        };

        console.log('Database data:', data);
        setDbData(data);
      } catch (error) {
        console.error('Error loading database:', error);
        setDbData({ error: String(error) });
      } finally {
        setLoading(false);
      }
    };

    loadDbData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading database...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Debug Info</h1>

      {dbData?.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {dbData.error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-100 border border-blue-400 p-4 rounded">
            <h2 className="font-bold mb-2">Record Counts</h2>
            <pre className="text-sm">{JSON.stringify(dbData?.counts, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 border border-gray-400 p-4 rounded">
            <h2 className="font-bold mb-2">Full Database Contents</h2>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(dbData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
