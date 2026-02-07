import { db } from './database';
import type { AppSettings } from '../../types';

const SETTINGS_ID = 'default';

/**
 * Get the app settings from the database
 * Creates default settings if they don't exist
 */
export async function getSettings(): Promise<AppSettings> {
  let settings = await db.settings.get(SETTINGS_ID);

  if (!settings) {
    // Create default settings with values from environment (for migration)
    settings = {
      id: SETTINGS_ID,
      aiProvider: (import.meta.env.VITE_AI_PROVIDER as AppSettings['aiProvider']) || 'mock',
      openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || undefined,
      updatedAt: new Date(),
    };

    await db.settings.put(settings);
    console.log('[Settings] Created default settings');
  }

  return settings;
}

/**
 * Update the app settings
 */
export async function updateSettings(updates: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings> {
  const currentSettings = await getSettings();

  const updatedSettings: AppSettings = {
    ...currentSettings,
    ...updates,
    id: SETTINGS_ID,
    updatedAt: new Date(),
  };

  await db.settings.put(updatedSettings);
  console.log('[Settings] Settings updated');

  return updatedSettings;
}

/**
 * Get the OpenAI API key from settings
 */
export async function getOpenAIApiKey(): Promise<string | undefined> {
  const settings = await getSettings();
  return settings.openaiApiKey;
}

/**
 * Update the OpenAI API key
 */
export async function setOpenAIApiKey(apiKey: string): Promise<void> {
  await updateSettings({ openaiApiKey: apiKey });
}

/**
 * Get the current AI provider from settings
 */
export async function getAIProvider(): Promise<AppSettings['aiProvider']> {
  const settings = await getSettings();
  return settings.aiProvider;
}

/**
 * Set the AI provider
 */
export async function setAIProvider(provider: AppSettings['aiProvider']): Promise<void> {
  await updateSettings({ aiProvider: provider });
}
