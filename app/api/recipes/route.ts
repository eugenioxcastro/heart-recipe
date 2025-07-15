import { NextResponse } from 'next/server';
import { generateRecipe } from '@/lib/openai';

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

    // Generate recipe with AI
    const generatedRecipe = await generateRecipe(mealType, numberOfPeople, emotions);
    
    return NextResponse.json({ recipes: [generatedRecipe] });
  } catch (error) {
    console.error('Error in GET /api/recipes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint is no longer needed since we're not storing recipes 