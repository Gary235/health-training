import type { Region } from '../types/user.types';

export interface RegionalIngredientInfo {
  ingredient: string;
  commonIn: Region[];
  lessCommonIn?: Region[];
  alternativesBy?: Partial<Record<Region, string[]>>;
  category?: 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice' | 'condiment';
}

// Comprehensive database of ingredient availability by region
export const REGIONAL_INGREDIENT_DATABASE: RegionalIngredientInfo[] = [
  // Proteins
  {
    ingredient: 'turkey',
    commonIn: ['north_america', 'europe'],
    lessCommonIn: ['south_america', 'asia', 'africa', 'oceania'],
    alternativesBy: {
      south_america: ['chicken', 'pork', 'beef'],
      asia: ['chicken', 'duck', 'pork'],
      africa: ['chicken', 'goat', 'beef'],
      oceania: ['chicken', 'lamb', 'beef'],
    },
    category: 'protein',
  },
  {
    ingredient: 'beef',
    commonIn: ['north_america', 'south_america', 'europe', 'oceania', 'middle_east'],
    lessCommonIn: ['asia'],
    category: 'protein',
  },
  {
    ingredient: 'chicken',
    commonIn: ['north_america', 'south_america', 'europe', 'asia', 'africa', 'oceania', 'middle_east'],
    category: 'protein',
  },
  {
    ingredient: 'pork',
    commonIn: ['north_america', 'europe', 'asia', 'south_america', 'oceania'],
    lessCommonIn: ['middle_east', 'africa'],
    alternativesBy: {
      middle_east: ['lamb', 'chicken', 'beef'],
      africa: ['goat', 'chicken', 'beef'],
    },
    category: 'protein',
  },
  {
    ingredient: 'lamb',
    commonIn: ['middle_east', 'europe', 'oceania', 'africa'],
    lessCommonIn: ['north_america', 'asia', 'south_america'],
    alternativesBy: {
      north_america: ['beef', 'pork', 'chicken'],
      asia: ['pork', 'chicken', 'goat'],
      south_america: ['beef', 'chicken', 'pork'],
    },
    category: 'protein',
  },
  {
    ingredient: 'goat',
    commonIn: ['middle_east', 'africa', 'asia'],
    lessCommonIn: ['north_america', 'europe', 'oceania', 'south_america'],
    alternativesBy: {
      north_america: ['lamb', 'beef', 'chicken'],
      europe: ['lamb', 'beef', 'pork'],
      oceania: ['lamb', 'beef', 'chicken'],
      south_america: ['beef', 'chicken', 'pork'],
    },
    category: 'protein',
  },
  {
    ingredient: 'duck',
    commonIn: ['asia', 'europe'],
    lessCommonIn: ['north_america', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      north_america: ['chicken', 'turkey', 'pork'],
      south_america: ['chicken', 'pork', 'beef'],
      africa: ['chicken', 'goat', 'beef'],
      oceania: ['chicken', 'lamb', 'pork'],
      middle_east: ['chicken', 'lamb', 'beef'],
    },
    category: 'protein',
  },
  {
    ingredient: 'salmon',
    commonIn: ['north_america', 'europe', 'oceania', 'asia'],
    lessCommonIn: ['africa', 'south_america', 'middle_east'],
    alternativesBy: {
      africa: ['tilapia', 'catfish', 'sardines'],
      south_america: ['tilapia', 'bass', 'trout'],
      middle_east: ['sea bass', 'grouper', 'tilapia'],
    },
    category: 'protein',
  },
  {
    ingredient: 'tofu',
    commonIn: ['asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'oceania', 'middle_east', 'africa'],
    alternativesBy: {
      north_america: ['tempeh', 'chickpeas', 'black beans'],
      europe: ['chickpeas', 'lentils', 'beans'],
      south_america: ['black beans', 'chickpeas', 'lentils'],
      oceania: ['tempeh', 'chickpeas', 'lentils'],
      middle_east: ['chickpeas', 'lentils', 'fava beans'],
      africa: ['lentils', 'chickpeas', 'beans'],
    },
    category: 'protein',
  },
  {
    ingredient: 'tempeh',
    commonIn: ['asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'oceania', 'middle_east', 'africa'],
    alternativesBy: {
      north_america: ['tofu', 'chickpeas', 'black beans'],
      europe: ['tofu', 'chickpeas', 'lentils'],
      south_america: ['black beans', 'chickpeas', 'lentils'],
      oceania: ['tofu', 'chickpeas', 'lentils'],
      middle_east: ['chickpeas', 'lentils', 'fava beans'],
      africa: ['lentils', 'chickpeas', 'beans'],
    },
    category: 'protein',
  },

  // Vegetables & Grains
  {
    ingredient: 'quinoa',
    commonIn: ['south_america'],
    lessCommonIn: ['north_america', 'europe', 'asia', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      north_america: ['rice', 'couscous', 'bulgur'],
      europe: ['couscous', 'rice', 'bulgur'],
      asia: ['rice', 'millet', 'buckwheat'],
      africa: ['couscous', 'millet', 'rice'],
      oceania: ['rice', 'couscous', 'bulgur'],
      middle_east: ['bulgur', 'couscous', 'rice'],
    },
    category: 'grain',
  },
  {
    ingredient: 'bok choy',
    commonIn: ['asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      north_america: ['spinach', 'kale', 'swiss chard'],
      europe: ['spinach', 'kale', 'cabbage'],
      south_america: ['spinach', 'collard greens', 'cabbage'],
      africa: ['spinach', 'kale', 'collard greens'],
      oceania: ['spinach', 'kale', 'cabbage'],
      middle_east: ['spinach', 'swiss chard', 'cabbage'],
    },
    category: 'vegetable',
  },
  {
    ingredient: 'kale',
    commonIn: ['north_america', 'europe'],
    lessCommonIn: ['asia', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      asia: ['bok choy', 'chinese cabbage', 'spinach'],
      south_america: ['collard greens', 'spinach', 'cabbage'],
      africa: ['collard greens', 'spinach', 'swiss chard'],
      oceania: ['spinach', 'cabbage', 'swiss chard'],
      middle_east: ['spinach', 'swiss chard', 'cabbage'],
    },
    category: 'vegetable',
  },
  {
    ingredient: 'avocado',
    commonIn: ['north_america', 'south_america'],
    lessCommonIn: ['europe', 'asia', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      europe: ['olive oil', 'nuts', 'seeds'],
      asia: ['coconut', 'sesame', 'peanuts'],
      africa: ['olive oil', 'peanuts', 'seeds'],
      oceania: ['olive oil', 'nuts', 'coconut'],
      middle_east: ['olive oil', 'tahini', 'nuts'],
    },
    category: 'vegetable',
  },

  // Dairy
  {
    ingredient: 'cheddar cheese',
    commonIn: ['north_america', 'europe', 'oceania'],
    lessCommonIn: ['asia', 'south_america', 'africa', 'middle_east'],
    alternativesBy: {
      asia: ['paneer', 'tofu', 'coconut milk'],
      south_america: ['queso fresco', 'mozzarella', 'cream cheese'],
      africa: ['feta', 'cottage cheese', 'yogurt'],
      middle_east: ['feta', 'halloumi', 'labneh'],
    },
    category: 'dairy',
  },
  {
    ingredient: 'feta cheese',
    commonIn: ['europe', 'middle_east'],
    lessCommonIn: ['north_america', 'asia', 'south_america', 'africa', 'oceania'],
    alternativesBy: {
      north_america: ['cheddar', 'mozzarella', 'goat cheese'],
      asia: ['paneer', 'cottage cheese', 'tofu'],
      south_america: ['queso fresco', 'cream cheese', 'mozzarella'],
      africa: ['cottage cheese', 'white cheese', 'yogurt'],
      oceania: ['cheddar', 'mozzarella', 'goat cheese'],
    },
    category: 'dairy',
  },
  {
    ingredient: 'paneer',
    commonIn: ['asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      north_america: ['cottage cheese', 'ricotta', 'tofu'],
      europe: ['ricotta', 'cottage cheese', 'feta'],
      south_america: ['queso fresco', 'cottage cheese', 'ricotta'],
      africa: ['cottage cheese', 'white cheese', 'feta'],
      oceania: ['cottage cheese', 'ricotta', 'tofu'],
      middle_east: ['feta', 'labneh', 'cottage cheese'],
    },
    category: 'dairy',
  },

  // Spices & Condiments
  {
    ingredient: 'soy sauce',
    commonIn: ['asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      north_america: ['worcestershire sauce', 'tamari', 'liquid aminos'],
      europe: ['worcestershire sauce', 'tamari', 'salt'],
      south_america: ['salt', 'lime juice', 'vinegar'],
      africa: ['salt', 'vinegar', 'tamarind'],
      oceania: ['worcestershire sauce', 'tamari', 'salt'],
      middle_east: ['salt', 'lemon juice', 'pomegranate molasses'],
    },
    category: 'condiment',
  },
  {
    ingredient: 'garam masala',
    commonIn: ['asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      north_america: ['curry powder', 'cumin', 'coriander'],
      europe: ['curry powder', 'mixed spices', 'paprika'],
      south_america: ['cumin', 'paprika', 'oregano'],
      africa: ['berbere', 'ras el hanout', 'curry powder'],
      oceania: ['curry powder', 'mixed spices', 'cumin'],
      middle_east: ['baharat', 'cumin', 'coriander'],
    },
    category: 'spice',
  },
  {
    ingredient: 'sriracha',
    commonIn: ['asia', 'north_america'],
    lessCommonIn: ['europe', 'south_america', 'africa', 'oceania', 'middle_east'],
    alternativesBy: {
      europe: ['hot sauce', 'chili flakes', 'cayenne pepper'],
      south_america: ['aji sauce', 'hot sauce', 'chili peppers'],
      africa: ['peri peri', 'hot sauce', 'chili peppers'],
      oceania: ['hot sauce', 'chili sauce', 'cayenne pepper'],
      middle_east: ['harissa', 'hot sauce', 'chili peppers'],
    },
    category: 'condiment',
  },
  {
    ingredient: 'tahini',
    commonIn: ['middle_east', 'asia'],
    lessCommonIn: ['north_america', 'europe', 'south_america', 'africa', 'oceania'],
    alternativesBy: {
      north_america: ['peanut butter', 'almond butter', 'sunflower seed butter'],
      europe: ['peanut butter', 'almond butter', 'sesame paste'],
      south_america: ['peanut butter', 'almond butter', 'cashew butter'],
      africa: ['peanut butter', 'sesame paste', 'groundnut paste'],
      oceania: ['peanut butter', 'almond butter', 'cashew butter'],
    },
    category: 'condiment',
  },
];

// Helper function to get common ingredients for a region
export function getCommonIngredientsForRegion(region: Region): string[] {
  return REGIONAL_INGREDIENT_DATABASE
    .filter((info) => info.commonIn.includes(region))
    .map((info) => info.ingredient);
}

// Helper function to get uncommon ingredients for a region
export function getUncommonIngredientsForRegion(region: Region): string[] {
  return REGIONAL_INGREDIENT_DATABASE
    .filter((info) => info.lessCommonIn?.includes(region))
    .map((info) => info.ingredient);
}

// Helper function to check if an ingredient is common in a region
export function isIngredientCommonInRegion(ingredient: string, region: Region): boolean {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  const info = REGIONAL_INGREDIENT_DATABASE.find(
    (item) => item.ingredient.toLowerCase() === normalizedIngredient
  );

  if (!info) {
    // If ingredient not in database, assume it's commonly available
    return true;
  }

  return info.commonIn.includes(region);
}

// Helper function to get alternatives for an ingredient in a specific region
export function getIngredientAlternatives(ingredient: string, region: Region): string[] {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  const info = REGIONAL_INGREDIENT_DATABASE.find(
    (item) => item.ingredient.toLowerCase() === normalizedIngredient
  );

  if (!info || !info.alternativesBy) {
    return [];
  }

  return info.alternativesBy[region] || [];
}

// Suggested cuisines by region
export const REGIONAL_CUISINES: Record<Region, string[]> = {
  north_america: ['American', 'Mexican', 'Italian', 'Chinese', 'Mediterranean'],
  south_america: ['Brazilian', 'Argentine', 'Peruvian', 'Colombian', 'Mexican'],
  europe: ['Italian', 'French', 'Spanish', 'Greek', 'German', 'Mediterranean'],
  asia: ['Chinese', 'Japanese', 'Thai', 'Indian', 'Korean', 'Vietnamese'],
  africa: ['Moroccan', 'Ethiopian', 'Nigerian', 'South African', 'Egyptian'],
  oceania: ['Australian', 'Pacific Islander', 'Asian Fusion', 'Mediterranean'],
  middle_east: ['Lebanese', 'Turkish', 'Persian', 'Israeli', 'Moroccan'],
};
