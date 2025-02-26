'use client';

import { FormEvent } from 'react';
import { useRecipe } from '@/app/context/RecipeContext';
import { MealType } from '@/types/supabase';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { EmotionPicker } from './EmotionPicker';

interface RecipeFormProps {
  onSubmit: (e: FormEvent) => void;
}

const mealTypes: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'brunch', label: 'Brunch' },
  { value: 'snack', label: 'Snack' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'dessert', label: 'Dessert' },
];

const peopleOptions = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} ${i === 0 ? 'person' : 'people'}`,
}));

export function RecipeForm({ onSubmit }: RecipeFormProps) {
  const { formData, updateFormData, resetForm } = useRecipe();

  const handleEmotionToggle = (emotionId: string) => {
    const newEmotions = formData.selectedEmotions.includes(emotionId)
      ? formData.selectedEmotions.filter(id => id !== emotionId)
      : [...formData.selectedEmotions, emotionId];
    
    updateFormData({ selectedEmotions: newEmotions });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.selectedEmotions.length === 0) {
      alert('Please select at least one emotion');
      return;
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="How many people are you cooking for?"
        value={formData.numberOfPeople}
        onChange={(e) => updateFormData({ numberOfPeople: Number(e.target.value) })}
        options={peopleOptions}
      />

      <Select
        label="What type of meal are you planning?"
        value={formData.mealType}
        onChange={(e) => updateFormData({ mealType: e.target.value as MealType })}
        options={mealTypes}
      />

      <div>
        <h3 className="mb-4 text-base font-medium text-gray-900">How are you feeling?</h3>
        <EmotionPicker
          selectedEmotions={formData.selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1">
          Find Recipe
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={resetForm}
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </form>
  );
} 