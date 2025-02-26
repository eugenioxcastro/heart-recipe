import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/types/supabase';
import { generateRecipe } from '@/lib/openai';

// Helper function to calculate match score
function calculateMatchScore(recipe: Recipe, query: {
  mealType: string;
  numberOfPeople: number;
  emotions: string[];
}): number {
  let score = 0;

  // Meal type match (40%)
  if (recipe.meal_type === query.mealType) {
    score += 40;
  }

  // Servings match (20%)
  if (query.numberOfPeople >= recipe.servings.min && 
      query.numberOfPeople <= recipe.servings.max) {
    score += 20;
  }

  // Emotions match (40%)
  if (query.emotions.length > 0) {
    const matchingEmotions = recipe.emotions.filter(emotion => 
      query.emotions.includes(emotion)
    ).length;
    const emotionScore = (matchingEmotions / Math.max(query.emotions.length, recipe.emotions.length)) * 40;
    score += emotionScore;
  } else {
    score += 40; // If no emotions selected, don't penalize
  }

  return score;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mealType = searchParams.get('mealType');
    const numberOfPeople = parseInt(searchParams.get('numberOfPeople') || '2');
    const emotions = searchParams.get('emotions')?.split(',') || [];

    if (!mealType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // First, get recipes matching the meal type
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('meal_type', mealType);

    if (error) {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (recipes?.length) {
      // Calculate match scores and sort
      const scoredRecipes = recipes.map(recipe => ({
        recipe,
        score: calculateMatchScore(recipe, {
          mealType,
          numberOfPeople,
          emotions,
        }),
      }));

      scoredRecipes.sort((a, b) => b.score - a.score);

      // Check for matches with score >= 90
      const matches = scoredRecipes
        .filter(({ score }) => score >= 90)
        .map(({ recipe }) => recipe);

      if (matches.length > 0) {
        // Update times_shown for matched recipes
        for (const recipe of matches) {
          await supabase
            .from('recipes')
            .update({ times_shown: (recipe.times_shown || 0) + 1 })
            .eq('id', recipe.id);
        }

        return NextResponse.json({ recipes: matches });
      }
    }

    // If no matching recipes found, generate one with AI
    const generatedRecipe = await generateRecipe(mealType, numberOfPeople, emotions);
    
    // Store the generated recipe
    const { data: newRecipe, error: insertError } = await supabase
      .from('recipes')
      .insert([generatedRecipe])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save generated recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipes: [newRecipe] });
  } catch (error) {
    console.error('Error in GET /api/recipes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const recipe = await request.json();

    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe: data });
  } catch (error) {
    console.error('Error in POST /api/recipes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 