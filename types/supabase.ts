export type MealType = 'breakfast' | 'brunch' | 'snack' | 'lunch' | 'dinner' | 'dessert';

export interface Recipe {
  id: string;
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
  image_url: string | null;
  prompt_used: string | null;
  times_shown: number;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'times_shown'>;
        Update: Partial<Omit<Recipe, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      meal_type_enum: MealType;
    };
  };
} 