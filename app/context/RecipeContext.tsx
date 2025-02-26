'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { RecipeFormData, MealType } from '../types';
import { Recipe } from '@/types/supabase';

interface RecipeContextType {
  formData: RecipeFormData;
  selectedRecipe: Recipe | null;
  updateFormData: (data: Partial<RecipeFormData>) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  resetForm: () => void;
}

const initialFormData: RecipeFormData = {
  numberOfPeople: 2,
  mealType: 'dinner' as MealType,
  selectedEmotions: [],
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const updateFormData = (data: Partial<RecipeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedRecipe(null);
  };

  return (
    <RecipeContext.Provider
      value={{
        formData,
        selectedRecipe,
        updateFormData,
        setSelectedRecipe,
        resetForm,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
} 