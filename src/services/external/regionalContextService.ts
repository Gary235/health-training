import type { Region } from '../../types/user.types';
import {
  REGIONAL_CUISINES,
  isIngredientCommonInRegion,
  getIngredientAlternatives,
  getCommonIngredientsForRegion,
  getUncommonIngredientsForRegion,
} from '../../data/regionalIngredients';

export class RegionalContextService {
  /**
   * Get list of ingredients commonly available in a region
   */
  getRegionalIngredients(region: Region): string[] {
    return getCommonIngredientsForRegion(region);
  }

  /**
   * Find alternative ingredients for a given ingredient in a target region
   */
  findIngredientAlternatives(ingredient: string, targetRegion: Region): string[] {
    return getIngredientAlternatives(ingredient, targetRegion);
  }

  /**
   * Check if an ingredient is commonly available in a region
   */
  isIngredientCommon(ingredient: string, region: Region): boolean {
    return isIngredientCommonInRegion(ingredient, region);
  }

  /**
   * Get suggested cuisines for a region
   */
  getCulturalCuisines(region: Region): string[] {
    return REGIONAL_CUISINES[region] || [];
  }

  /**
   * Get uncommon ingredients in a region
   */
  getUncommonIngredients(region: Region): string[] {
    return getUncommonIngredientsForRegion(region);
  }

  /**
   * Analyze a recipe's ingredients for regional appropriateness
   */
  analyzeRecipeForRegion(
    ingredients: string[],
    region: Region
  ): {
    commonIngredients: string[];
    uncommonIngredients: string[];
    suggestedAlternatives: Record<string, string[]>;
  } {
    const commonIngredients: string[] = [];
    const uncommonIngredients: string[] = [];
    const suggestedAlternatives: Record<string, string[]> = {};

    for (const ingredient of ingredients) {
      const isCommon = this.isIngredientCommon(ingredient, region);

      if (isCommon) {
        commonIngredients.push(ingredient);
      } else {
        uncommonIngredients.push(ingredient);
        const alternatives = this.findIngredientAlternatives(ingredient, region);
        if (alternatives.length > 0) {
          suggestedAlternatives[ingredient] = alternatives;
        }
      }
    }

    return {
      commonIngredients,
      uncommonIngredients,
      suggestedAlternatives,
    };
  }

  /**
   * Generate regional context text for AI prompts
   */
  generateRegionalContext(region: Region, preferLocalIngredients: boolean): string {
    const cuisines = this.getCulturalCuisines(region);
    const commonIngredients = this.getRegionalIngredients(region);

    let context = `Region: ${this.getRegionDisplayName(region)}\n`;
    context += `Popular cuisines: ${cuisines.join(', ')}\n`;

    if (preferLocalIngredients) {
      context += `\nPrefer ingredients commonly available in ${this.getRegionDisplayName(region)}:\n`;
      context += `${commonIngredients.slice(0, 20).join(', ')}, and similar local ingredients.\n`;
      context += `\nAvoid or minimize use of ingredients that are less common in this region.`;
    } else {
      context += `\nWhen using less common ingredients, consider suggesting local alternatives.`;
    }

    return context;
  }

  /**
   * Get display name for a region
   */
  private getRegionDisplayName(region: Region): string {
    const displayNames: Record<Region, string> = {
      north_america: 'North America',
      south_america: 'South America',
      europe: 'Europe',
      asia: 'Asia',
      africa: 'Africa',
      oceania: 'Oceania',
      middle_east: 'Middle East',
    };

    return displayNames[region] || region;
  }

  /**
   * Get region-specific cooking tips
   */
  getRegionalCookingTips(region: Region): string[] {
    const tips: Record<Region, string[]> = {
      north_america: [
        'Common measurement system: US customary (cups, tablespoons)',
        'Popular cooking methods: Grilling, baking, roasting',
        'Typical meal structure: Main protein with sides',
      ],
      south_america: [
        'Common measurement system: Metric (liters, grams)',
        'Popular cooking methods: Grilling, stewing, slow cooking',
        'Fresh ingredients are often preferred',
      ],
      europe: [
        'Common measurement system: Metric (liters, grams)',
        'Popular cooking methods: Baking, sautéing, braising',
        'Emphasis on fresh, seasonal ingredients',
      ],
      asia: [
        'Common measurement system: Metric (liters, grams)',
        'Popular cooking methods: Stir-frying, steaming, boiling',
        'Rice often served as a staple with meals',
      ],
      africa: [
        'Common measurement system: Metric (liters, grams)',
        'Popular cooking methods: Stewing, grilling, slow cooking',
        'Emphasis on communal meals and hearty stews',
      ],
      oceania: [
        'Common measurement system: Metric (liters, grams)',
        'Popular cooking methods: Grilling, baking, barbecuing',
        'Fresh seafood and local produce are common',
      ],
      middle_east: [
        'Common measurement system: Metric (liters, grams)',
        'Popular cooking methods: Grilling, roasting, stewing',
        'Emphasis on spices and aromatic ingredients',
      ],
    };

    return tips[region] || [];
  }
}

// Export singleton instance
export const regionalContextService = new RegionalContextService();
