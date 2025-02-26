import OpenAI from 'openai';
import { Recipe } from '@/types/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the function schema for OpenAI to follow
const RECIPE_FUNCTION = {
  name: 'generateRecipe',
  description: 'Generate a recipe based on meal type, number of people, and emotions',
  parameters: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the recipe that reflects the emotions and meal type'
      },
      description: {
        type: 'string',
        description: 'Engaging description that connects the recipe to the requested emotions'
      },
      meal_type: {
        type: 'string',
        enum: ['breakfast', 'brunch', 'snack', 'lunch', 'dinner', 'dessert']
      },
      servings: {
        type: 'object',
        properties: {
          min: { type: 'number' },
          max: { type: 'number' }
        },
        required: ['min', 'max']
      },
      emotions: {
        type: 'array',
        items: { type: 'string' }
      },
      prep_time: { type: 'string' },
      cook_time: { type: 'string' },
      total_time: { type: 'string' },
      ingredients: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            item: { type: 'string' },
            amount: { type: 'string' },
            unit: { type: 'string' }
          },
          required: ['item', 'amount', 'unit']
        }
      },
      steps: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: [
      'name', 'description', 'meal_type', 'servings', 'emotions',
      'prep_time', 'cook_time', 'total_time', 'ingredients', 'steps'
    ]
  }
};

export async function generateRecipe(
  mealType: string,
  numberOfPeople: number,
  emotions: string[]
): Promise<Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'times_shown'>> {
  try {
    console.log('Starting recipe generation:', { mealType, numberOfPeople, emotions });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `You are a culinary expert who creates recipes that evoke specific emotions. 
                   Focus on creating recipes that are practical, delicious, and truly connect 
                   with the requested emotions through ingredients, preparation methods, and presentation.`
        },
        {
          role: 'user',
          content: `Create a ${mealType} recipe for ${numberOfPeople} people that evokes these emotions: ${emotions.join(', ')}.
                   The recipe should be practical to make at home and use commonly available ingredients.`
        }
      ],
      functions: [RECIPE_FUNCTION],
      function_call: { name: 'generateRecipe' },
      temperature: 0.7,
    });

    const functionCall = response.choices[0]?.message?.function_call;
    if (!functionCall?.arguments) {
      console.error('No function call in response:', response);
      throw new Error('No recipe generated');
    }

    console.log('Raw OpenAI response:', functionCall.arguments);
    const recipe = JSON.parse(functionCall.arguments);

    // Validate the recipe format
    if (!recipe.name || !recipe.description || !recipe.ingredients || !recipe.steps) {
      console.error('Invalid recipe format:', recipe);
      throw new Error('Generated recipe is missing required fields');
    }

    // Ensure servings match the request
    recipe.servings = {
      min: numberOfPeople,
      max: Math.min(numberOfPeople + 2, 8) // Allow some flexibility but cap at 8
    };

    // Ensure meal_type matches the request
    recipe.meal_type = mealType;

    // Ensure emotions are included
    recipe.emotions = emotions;

    console.log('Generated recipe:', recipe);

    return {
      ...recipe,
      is_ai_generated: true,
      prompt_used: `${mealType} recipe for ${numberOfPeople} people with emotions: ${emotions.join(', ')}`,
      image_url: null
    };
  } catch (error) {
    console.error('Error in generateRecipe:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate recipe');
  }
} 