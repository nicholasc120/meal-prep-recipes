import { marked } from 'marked'
import type { Recipe, RecipeFrontmatter, RecipeCategory, RecipeDifficulty } from './types'

function parseFrontmatter(content: string): { frontmatter: Partial<RecipeFrontmatter>, body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const [, frontmatterStr, body] = match
  const frontmatter: Partial<RecipeFrontmatter> = {}

  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim()
      const cleanKey = key.trim() as keyof RecipeFrontmatter

      if (cleanKey === 'rating' || cleanKey === 'portions' || cleanKey === 'calories') {
        frontmatter[cleanKey] = parseInt(value, 10) as any
      } else if (cleanKey === 'category' || cleanKey === 'difficulty' || cleanKey === 'title' || cleanKey === 'prepTime' || cleanKey === 'cookTime' || cleanKey === 'protein') {
        frontmatter[cleanKey] = value as any
      }
    }
  })

  return { frontmatter, body }
}

export async function parseRecipe(slug: string, rawContent: string): Promise<Recipe> {
  const { frontmatter, body } = parseFrontmatter(rawContent)

  const htmlContent = await marked(body)

  return {
    slug,
    title: frontmatter.title || 'Untitled Recipe',
    category: (frontmatter.category as RecipeCategory) || 'Other',
    rating: frontmatter.rating || 3,
    difficulty: (frontmatter.difficulty as RecipeDifficulty) || 'Medium',
    portions: frontmatter.portions || 1,
    prepTime: frontmatter.prepTime,
    cookTime: frontmatter.cookTime,
    calories: frontmatter.calories,
    protein: frontmatter.protein,
    content: htmlContent,
    rawContent: body
  }
}

export async function loadRecipes(): Promise<Recipe[]> {
  const recipeFiles = [
    'honey-garlic-chicken.md',
    'korean-beef-bowl.md',
    'chimichurri-steak.md',
    'sheet-pan-chicken.md',
    'teriyaki-salmon.md',
    'taco-stuffed-peppers.md',
    'turkey-lettuce-wraps.md'
  ]

  const recipes: Recipe[] = []
  const baseUrl = import.meta.env.BASE_URL

  for (const filename of recipeFiles) {
    try {
      const response = await fetch(`${baseUrl}recipes/${filename}`)
      if (response.ok) {
        const content = await response.text()
        const slug = filename.replace('.md', '')
        const recipe = await parseRecipe(slug, content)
        recipes.push(recipe)
      }
    } catch (error) {
      console.error(`Failed to load recipe: ${filename}`, error)
    }
  }

  return recipes
}
