import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link as LinkIcon } from '@phosphor-icons/react'
import { loadIngredients } from '@/lib/ingredients'
import type { Ingredient } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function IngredientsPage() {
  const ingredients = loadIngredients()
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    function checkHash() {
      const match = window.location.hash.match(/^#ingredient\/(.+)$/)
      if (match) {
        const slug = decodeURIComponent(match[1])
        setHighlightedSlug(slug)
        setTimeout(() => {
          cardRefs.current[slug]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}${window.location.pathname}#ingredient/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
  }

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Common Ingredients</h2>
        <p className="text-muted-foreground">
          Where I source the ingredients used across these recipes.
        </p>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search ingredients or stores..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No ingredients match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredIngredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.slug}
                ref={el => { cardRefs.current[ingredient.slug] = el }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={cn(
                  'h-full hover:shadow-lg transition-all',
                  highlightedSlug === ingredient.slug && 'ring-2 ring-primary shadow-lg'
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{ingredient.name}</CardTitle>
                      <button
                        onClick={() => copyLink(ingredient.slug)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                        title="Copy link to ingredient"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {ingredient.notes && (
                      <p className="text-sm text-muted-foreground">{ingredient.notes}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
