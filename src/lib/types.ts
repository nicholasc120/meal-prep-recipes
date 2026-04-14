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
  original?: boolean
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
  original?: boolean
}

export interface Ingredient {
  slug: string
  name: string
  notes?: string
}
