import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './store';
import { initializeDatabase } from './services/db/database';
import { hydrateStoreFromDB } from './services/sync/syncMiddleware';
import OfflineIndicator from './components/common/OfflineIndicator';
import InstallPrompt from './components/common/InstallPrompt';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import GenerateMealPlanPage from './pages/GenerateMealPlanPage';
import GenerateTrainingPlanPage from './pages/GenerateTrainingPlanPage';
import MealPlanPage from './pages/MealPlanPage';
import TrainingPlanPage from './pages/TrainingPlanPage';
import DailyPage from './pages/DailyPage';
import ShoppingListPage from './pages/ShoppingListPage';
import AdherenceAnalysisPage from './pages/AdherenceAnalysisPage';
import MetricsPage from './pages/MetricsPage';
import HistoryPage from './pages/HistoryPage';
import DebugPage from './pages/DebugPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('[App] Starting initialization...');
        await initializeDatabase();
        console.log('[App] Database initialized, starting hydration...');
        await hydrateStoreFromDB(dispatch);
        console.log('[App] Initialization complete');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Still set initialized to true to prevent infinite loading
        setIsInitialized(true);
      }
    };
    init();
  }, []); // Empty deps to run only once

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-sm text-muted-foreground">Initializing app...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <InstallPrompt />
      <Toaster />
      <Router>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/edit" element={<ProfileEditPage />} />
                  <Route path="/plans/meal" element={<MealPlanPage />} />
                  <Route path="/plans/meal/generate" element={<GenerateMealPlanPage />} />
                  <Route path="/plans/training" element={<TrainingPlanPage />} />
                  <Route path="/plans/training/generate" element={<GenerateTrainingPlanPage />} />
                  <Route path="/daily" element={<DailyPage />} />
                  <Route path="/shopping-list" element={<ShoppingListPage />} />
                  <Route path="/adherence-analysis" element={<AdherenceAnalysisPage />} />
                  <Route path="/metrics" element={<MetricsPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/debug" element={<DebugPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
