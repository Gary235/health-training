import type { Region } from '../types/user.types';

/**
 * Map timezone to region based on common timezone patterns
 */
function mapTimezoneToRegion(timezone: string): Region {
  const tz = timezone.toLowerCase();

  // North America
  if (
    tz.includes('america/new_york') ||
    tz.includes('america/chicago') ||
    tz.includes('america/denver') ||
    tz.includes('america/los_angeles') ||
    tz.includes('america/toronto') ||
    tz.includes('america/vancouver') ||
    tz.includes('america/mexico')
  ) {
    return 'north_america';
  }

  // South America
  if (
    tz.includes('america/sao_paulo') ||
    tz.includes('america/argentina') ||
    tz.includes('america/lima') ||
    tz.includes('america/bogota') ||
    tz.includes('america/santiago') ||
    tz.includes('america/caracas')
  ) {
    return 'south_america';
  }

  // Europe
  if (
    tz.includes('europe/') ||
    tz.includes('atlantic/reykjavik') ||
    tz.includes('utc') ||
    tz.includes('gmt')
  ) {
    return 'europe';
  }

  // Asia
  if (
    tz.includes('asia/') ||
    tz.includes('pacific/auckland') === false && tz.includes('pacific/')
  ) {
    return 'asia';
  }

  // Middle East (more specific than Asia)
  if (
    tz.includes('asia/dubai') ||
    tz.includes('asia/riyadh') ||
    tz.includes('asia/baghdad') ||
    tz.includes('asia/tehran') ||
    tz.includes('asia/jerusalem') ||
    tz.includes('asia/beirut') ||
    tz.includes('asia/damascus')
  ) {
    return 'middle_east';
  }

  // Africa
  if (tz.includes('africa/')) {
    return 'africa';
  }

  // Oceania
  if (
    tz.includes('australia/') ||
    tz.includes('pacific/auckland') ||
    tz.includes('pacific/fiji')
  ) {
    return 'oceania';
  }

  // Default to North America if unable to determine
  return 'north_america';
}

/**
 * Detect user's region based on browser timezone
 * Returns detected region and confidence level
 */
export async function detectUserRegion(): Promise<{
  region: Region;
  timezone: string;
  confidence: 'high' | 'medium' | 'low';
}> {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const region = mapTimezoneToRegion(timezone);

    // Determine confidence based on how specific the timezone is
    let confidence: 'high' | 'medium' | 'low' = 'medium';

    if (timezone.includes('america/') || timezone.includes('europe/') || timezone.includes('asia/')) {
      confidence = 'high';
    } else if (timezone.includes('utc') || timezone.includes('gmt')) {
      confidence = 'low';
    }

    return {
      region,
      timezone,
      confidence,
    };
  } catch (error) {
    console.error('Failed to detect user region:', error);
    // Fallback to North America
    return {
      region: 'north_america',
      timezone: 'Unknown',
      confidence: 'low',
    };
  }
}

/**
 * Get a human-readable description of a region
 */
export function getRegionDescription(region: Region): string {
  const descriptions: Record<Region, string> = {
    north_america: 'North America (USA, Canada, Mexico)',
    south_america: 'South America (Brazil, Argentina, Peru, etc.)',
    europe: 'Europe',
    asia: 'Asia (China, Japan, India, Southeast Asia)',
    africa: 'Africa',
    oceania: 'Oceania (Australia, New Zealand, Pacific Islands)',
    middle_east: 'Middle East (UAE, Saudi Arabia, Israel, etc.)',
  };

  return descriptions[region] || region;
}

/**
 * Get all available regions with descriptions
 */
export function getAllRegions(): Array<{ value: Region; label: string; description: string }> {
  const regions: Region[] = [
    'north_america',
    'south_america',
    'europe',
    'asia',
    'africa',
    'oceania',
    'middle_east',
  ];

  return regions.map((region) => ({
    value: region,
    label: region
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: getRegionDescription(region),
  }));
}
