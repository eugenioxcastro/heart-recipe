'use client';

import { Recipe } from '@/types/supabase';
import Image from 'next/image';
import { emotions } from '@/app/data/emotions';

interface RecipeDisplayProps {
  recipe: Recipe | null;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const recipeEmotions = emotions.filter(e => recipe?.emotions.includes(e.id));

  return (
    <div className="space-y-8">
      {recipe?.image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{recipe?.name}</h2>
        <p className="text-gray-600">{recipe?.description}</p>

        <div className="flex flex-wrap gap-2">
          {recipeEmotions.map((emotion) => (
            <span
              key={emotion.id}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${emotion.category === 'basic' 
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-purple-100 text-purple-800'
                }`}
            >
              {emotion.label}
            </span>
          ))}
        </div>

        <div className="flex gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">Prep:</span> {recipe?.prep_time}
          </div>
          <div>
            <span className="font-medium">Cook:</span> {recipe?.cook_time}
          </div>
          <div>
            <span className="font-medium">Total:</span> {recipe?.total_time}
          </div>
          <div>
            <span className="font-medium">Serves:</span> {recipe?.servings.min}-{recipe?.servings.max}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Ingredients</h3>
        <ul className="list-inside list-disc space-y-2 text-gray-600">
          {recipe?.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Instructions</h3>
        <ol className="list-inside list-decimal space-y-4 text-gray-600">
          {recipe?.steps.map((step, index) => (
            <li key={index} className="pl-2">
              <span className="font-medium text-gray-900">Step {index + 1}:</span>{' '}
              {step}
            </li>
          ))}
        </ol>
      </div>

      {recipe?.is_ai_generated && (
        <div className="mt-6 text-center text-sm text-gray-500">
          This recipe was crafted by AI based on your preferences
        </div>
      )}
    </div>
  );
} 