export type RecipeCategory = 'Chicken' | 'Ground Beef' | 'Steak' | 'Other'
export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface Recipe {
  slug: string
  title: string
  category: RecipeCategory
  rating: number
  difficulty: RecipeDifficulty
  portions: number
  prepTime?: string
  cookTime?: string
  calories?: number
  protein?: string
  content: string
  rawContent: string
}

export interface RecipeFrontmatter {
  title: string
  category: RecipeCategory
  rating: number
  difficulty: RecipeDifficulty
  portions: number
  prepTime?: string
  cookTime?: string
  calories?: number
  protein?: string
}

export interface Ingredient {
  id: string
  name: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  store: string
  notes?: string
}
