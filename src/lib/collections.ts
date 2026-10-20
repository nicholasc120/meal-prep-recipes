import { marked } from 'marked'

export type CollectionId = 'breakfast' | 'vegetables' | 'other'

export interface CollectionEntry {
  slug: string
  title: string
  description?: string
  calories?: string
  protein?: string
  content: string
}

export const COLLECTIONS: { id: CollectionId; label: string; heading: string; blurb: string }[] = [
  { id: 'breakfast', label: 'Breakfast', heading: 'Breakfast', blurb: 'Recipes I use for breakfast.' },
  { id: 'vegetables', label: 'Vegetables', heading: 'Vegetables', blurb: 'The vegetables I use and how I cook them.' },
  { id: 'other', label: 'Other', heading: 'Other', blurb: 'Regular recipes I like to cook.' },
]

// Add a .md file to the matching folder under src/collections/ to add an entry.
const modules: Record<CollectionId, Record<string, string>> = {
  breakfast: import.meta.glob<string>('/src/collections/breakfast/*.md', { query: '?raw', import: 'default', eager: true }),
  vegetables: import.meta.glob<string>('/src/collections/vegetables/*.md', { query: '?raw', import: 'default', eager: true }),
  other: import.meta.glob<string>('/src/collections/other/*.md', { query: '?raw', import: 'default', eager: true }),
}

function parse(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  match[1].split(/\r?\n/).forEach(line => {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  })
  return { meta, body: match[2] }
}

const vegetableListRaw = Object.values(
  import.meta.glob<string>('/src/collections/vegetables-list.md', { query: '?raw', import: 'default', eager: true })
)[0] || ''

// Edit src/collections/vegetables-list.md (one "- item" per line) to change the list.
export function loadVegetableList(): string[] {
  return vegetableListRaw
    .split(/\r?\n/)
    .map(l => l.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean)
}

export async function loadCollection(id: CollectionId): Promise<CollectionEntry[]> {
  const entries = await Promise.all(
    Object.entries(modules[id]).map(async ([path, raw]) => {
      const slug = (path.split('/').pop() || '').replace(/\.md$/, '')
      const { meta, body } = parse(raw)
      return {
        slug,
        title: meta.title || slug,
        description: meta.description,
        calories: meta.calories,
        protein: meta.protein,
        content: await marked(body),
      }
    })
  )
  return entries.sort((a, b) => a.title.localeCompare(b.title))
}
