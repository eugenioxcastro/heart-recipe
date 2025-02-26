'use client';

import { FormEvent, useState } from 'react';
import { MainLayout } from './components/templates/MainLayout';
import { RecipeForm } from './components/molecules/RecipeForm';
import { RecipeDisplay } from './components/molecules/RecipeDisplay';
import { RecipeProvider, useRecipe } from './context/RecipeContext';

function RecipePage() {
  const { formData, selectedRecipe, setSelectedRecipe } = useRecipe();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        mealType: formData.mealType,
        numberOfPeople: formData.numberOfPeople.toString(),
        emotions: formData.selectedEmotions.join(','),
      });

      const response = await fetch(`/api/recipes?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recipe');
      }

      if (data.recipes && data.recipes.length > 0) {
        setSelectedRecipe(data.recipes[0]);
      } else {
        setError('No matching recipes found');
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl">
        <div 
          className={`transition-all duration-300 ${
            selectedRecipe ? 'mb-16 scale-95 opacity-50' : ''
          }`}
        >
          <div 
            className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-8"
            onClick={() => selectedRecipe && setSelectedRecipe(null)}
          >
            <RecipeForm onSubmit={handleSubmit} />
          </div>
        </div>

        {isLoading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-400 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Crafting your perfect recipe...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {selectedRecipe && !isLoading && (
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5 sm:p-8">
            <RecipeDisplay recipe={selectedRecipe} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function Home() {
  return (
    <RecipeProvider>
      <RecipePage />
    </RecipeProvider>
  );
}
