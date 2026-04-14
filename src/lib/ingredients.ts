import type { Ingredient } from './types'

import rawContent from '@/ingredients.md?raw'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function loadIngredients(): Ingredient[] {
  const ingredients: Ingredient[] = []
  const sections = rawContent.split(/^## /m).filter(Boolean)

  for (const section of sections) {
    const lines = section.trim().split('\n')
    const name = lines[0].trim()
    let notes: string | undefined
    let macros: string | undefined

    for (const line of lines.slice(1)) {
      const notesMatch = line.match(/\*\*Notes\*\*:\s*(.+)/)
      const macrosMatch = line.match(/\*\*Macros\*\*:\s*(.+)/)
      if (notesMatch) notes = notesMatch[1].trim()
      if (macrosMatch) macros = macrosMatch[1].trim()
    }

    ingredients.push({
      slug: slugify(name),
      name,
      macros,
      notes,
    })
  }

  return ingredients
}
