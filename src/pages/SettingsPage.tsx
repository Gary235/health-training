import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { getSettings, updateSettings } from '../services/db/settingsService';
import { switchAIProvider } from '../services/ai/AIServiceFactory';
import type { AppSettings } from '../types';
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState<AppSettings['aiProvider']>('mock');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentSettings = await getSettings();
        setSettings(currentSettings);
        setOpenaiApiKey(currentSettings.openaiApiKey || '');
        setAiProvider(currentSettings.aiProvider);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoadingInitial(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      // Update settings in database
      const updatedSettings = await updateSettings({
        aiProvider,
        openaiApiKey: openaiApiKey || undefined,
      });

      // Update AI service with new settings
      await switchAIProvider(aiProvider, openaiApiKey || undefined);

      setSettings(updatedSettings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-sm text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your AI provider and API keys
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ai-provider">AI Provider</Label>
              <SelectRoot value={aiProvider} onValueChange={(value) => setAiProvider(value as AppSettings['aiProvider'])}>
                <SelectTrigger id="ai-provider">
                  <SelectValue>
                    {aiProvider === 'mock' && 'Mock (Free, for testing)'}
                    {aiProvider === 'openai' && 'OpenAI (Requires API key)'}
                    {aiProvider === 'anthropic' && 'Anthropic (Coming soon)'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mock">Mock (Free, for testing)</SelectItem>
                  <SelectItem value="openai">OpenAI (Requires API key)</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Coming soon)</SelectItem>
                </SelectContent>
              </SelectRoot>
              <p className="text-sm text-muted-foreground">
                Choose which AI provider to use for generating meal and training plans.
              </p>
            </div>

            {aiProvider === 'openai' && (
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showApiKey ? 'Hide' : 'Show'} API key
                    </span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Configuration</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Provider: <span className="font-mono">{settings?.aiProvider || 'None'}</span></p>
                  <p>API Key: <span className="font-mono">{settings?.openaiApiKey ? '••••••••' : 'Not set'}</span></p>
                  <p>Last Updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
