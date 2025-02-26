import { supabase } from '../lib/supabase';

const initialRecipe = {
  name: 'Creamy Comfort Mac & Cheese',
  meal_type: 'dinner',
  servings: {
    min: 2,
    max: 6,
  },
  emotions: ['comforted', 'cozy', 'happy', 'nostalgic'],
  ingredients: [
    { item: 'elbow macaroni', amount: '16', unit: 'oz' },
    { item: 'cheddar cheese', amount: '2', unit: 'cups' },
    { item: 'milk', amount: '2', unit: 'cups' },
    { item: 'butter', amount: '4', unit: 'tbsp' },
    { item: 'flour', amount: '1/4', unit: 'cup' },
    { item: 'breadcrumbs', amount: '1', unit: 'cup' },
  ],
  steps: [
    'Cook macaroni according to package instructions',
    'Make a roux with butter and flour',
    'Gradually add milk to create a bechamel sauce',
    'Add cheese and stir until melted',
    'Combine with cooked pasta',
    'Top with breadcrumbs and bake until golden',
  ],
  description: 'A warm, creamy mac & cheese that feels like a hug in a bowl.',
  prep_time: '15 mins',
  cook_time: '25 mins',
  total_time: '40 mins',
  is_ai_generated: false,
};

async function seedInitialRecipe() {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert([initialRecipe])
      .select()
      .single();

    if (error) {
      console.error('Error seeding recipe:', error);
      return;
    }

    console.log('Successfully seeded initial recipe:', data);
  } catch (error) {
    console.error('Error in seed script:', error);
  } finally {
    process.exit(0);
  }
}

seedInitialRecipe(); 