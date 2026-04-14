import { useState, useEffect, useCallback } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { RecipesPage } from '@/components/RecipesPage'
import { IngredientsPage } from '@/components/IngredientsPage'
import { Info, CookingPot, ShoppingCart } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type Page = 'recipes' | 'ingredients'

function getPageFromHash(): Page {
  const hash = window.location.hash
  if (hash === '#ingredients' || hash.startsWith('#ingredient/')) return 'ingredients'
  return 'recipes'
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash)

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((target: Page) => {
    if (target === 'ingredients') {
      window.location.hash = 'ingredients'
    } else {
      history.pushState(null, '', window.location.pathname + window.location.search)
      setPage('recipes')
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 70px)`
        }}></div>
        <div className="relative px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 tracking-tight leading-tight">
              Nich's Meal Prep Recipes
            </h1>
            <div className="flex items-start gap-3 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-5">
              <Info className="h-6 w-6 text-primary-foreground flex-shrink-0 mt-0.5" weight="duotone" />
              <div className="text-primary-foreground/95">
                <p className="text-lg leading-relaxed">
                  Every recipe in this collection is has{' '}
                  <span className="font-semibold">500-600 calories</span> with at least{' '}
                  <span className="font-semibold">40 grams of protein</span> per serving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-6 md:px-12 lg:px-24 flex gap-1 py-2">
          <button
            onClick={() => navigate('recipes')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              page === 'recipes'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <CookingPot className="h-4 w-4" />
            Recipes
          </button>
          <button
            onClick={() => navigate('ingredients')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              page === 'ingredients'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Ingredients
          </button>
        </div>
      </nav>

      <div className="px-6 md:px-12 lg:px-24 py-12">
        {page === 'recipes' ? <RecipesPage /> : <IngredientsPage />}
      </div>
    </div>
  )
}

export default App