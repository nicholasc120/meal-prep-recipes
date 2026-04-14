import { marked } from 'marked'
import type { Recipe, RecipeFrontmatter, RecipeCategory, RecipeDifficulty } from './types'

const recipeModules = import.meta.glob<string>('/src/recipes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

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
      } else if (cleanKey === 'original') {
        frontmatter[cleanKey] = value.toLowerCase() === 'true'
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
    original: frontmatter.original,
    content: htmlContent,
    rawContent: body
  }
}

export async function loadRecipes(): Promise<Recipe[]> {
  const recipes: Recipe[] = []

  for (const [path, rawContent] of Object.entries(recipeModules)) {
    try {
      const filename = path.split('/').pop() || ''
      const slug = filename.replace('.md', '')
      const recipe = await parseRecipe(slug, rawContent)
      recipes.push(recipe)
    } catch (error) {
      console.error(`Failed to parse recipe: ${path}`, error)
    }
  }

  return recipes
}
