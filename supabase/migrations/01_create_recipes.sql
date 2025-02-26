-- Create enum for meal types
create type meal_type_enum as enum (
  'breakfast', 'brunch', 'snack', 'lunch', 'dinner', 'dessert'
);

-- Create recipes table
create table recipes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  meal_type meal_type_enum not null,
  servings jsonb not null, -- { min: number, max: number }
  emotions text[] not null,
  ingredients jsonb not null, -- Array of { item, amount, unit }
  steps text[] not null,
  description text not null,
  prep_time text not null,
  cook_time text not null,
  total_time text not null,
  image_url text,
  -- Metadata
  prompt_used text,
  times_shown integer default 0,
  is_ai_generated boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_recipes_updated_at
  before update on recipes
  for each row
  execute function update_updated_at_column(); 