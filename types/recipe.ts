export type MealType = 'breakfast' | 'brunch' | 'snack' | 'lunch' | 'dinner' | 'dessert';

export interface Recipe {
  name: string;
  meal_type: MealType;
  servings: {
    min: number;
    max: number;
  };
  emotions: string[];
  ingredients: {
    item: string;
    amount: string;
    unit: string;
  }[];
  steps: string[];
  description: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  image_url?: string;
  prompt_used?: string;
  is_ai_generated: boolean;
} 