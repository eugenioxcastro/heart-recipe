export type MealType = 'breakfast' | 'brunch' | 'snack' | 'lunch' | 'dinner' | 'dessert';

export type Emotion = {
  id: string;
  label: string;
  category: 'basic' | 'complex';
};

export interface Recipe {
  id: string;
  name: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: {
    min: number;
    max: number;
  };
  mealType: MealType;
  emotions: string[];
  ingredients: {
    item: string;
    amount: string;
    unit: string;
  }[];
  steps: string[];
  imageUrl: string;
  description: string;
}

export interface RecipeFormData {
  numberOfPeople: number;
  mealType: MealType;
  selectedEmotions: string[];
} 