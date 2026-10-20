import { useState, useEffect, useCallback } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { RecipesPage } from '@/components/RecipesPage'
import { IngredientsPage } from '@/components/IngredientsPage'
import { CollectionPage } from '@/components/CollectionPage'
import { COLLECTIONS, type CollectionId } from '@/lib/collections'
import { Info, CookingPot, ShoppingCart, ArrowLeft } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type Page = 'recipes' | 'ingredients' | CollectionId

function getPageFromHash(): Page {
  const hash = window.location.hash
  const section = COLLECTIONS.find(c => hash === `#${c.id}` || hash.startsWith(`#${c.id}/`))
  if (section) return section.id
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
    if (target !== 'recipes') {
      window.location.hash = target
    } else {
      history.pushState(null, '', window.location.pathname + window.location.search)
      setPage('recipes')
    }
  }, [])

  const section = COLLECTIONS.find(c => c.id === page)
  const tabClass = (active: boolean) => cn(
    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
  )

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
              {section ? `Nich's ${section.heading}` : "Nich's Meal Prep Recipes"}
            </h1>
            {!section && <div className="flex items-start gap-3 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-5">
              <Info className="h-6 w-6 text-primary-foreground flex-shrink-0 mt-0.5" weight="duotone" />
              <div className="text-primary-foreground/95">
                <p className="text-lg leading-relaxed">
                  Every recipe in this collection is has{' '}
                  <span className="font-semibold">500-600 calories</span> with at least{' '}
                  <span className="font-semibold">40 grams of protein</span> per serving.
                </p>
              </div>
            </div>}
          </div>
        </div>
      </div>

      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-6 md:px-12 lg:px-24 flex flex-wrap gap-1 py-2">
          {section ? (
            <>
              <button onClick={() => navigate('recipes')} className={tabClass(false)}>
                <ArrowLeft className="h-4 w-4" />
                Meal Prep
              </button>
              {COLLECTIONS.map(c => (
                <button key={c.id} onClick={() => navigate(c.id)} className={tabClass(page === c.id)}>
                  {c.label}
                </button>
              ))}
            </>
          ) : (
            <>
              <button onClick={() => navigate('recipes')} className={tabClass(page === 'recipes')}>
                <CookingPot className="h-4 w-4" />
                Recipes
              </button>
              <button onClick={() => navigate('ingredients')} className={tabClass(page === 'ingredients')}>
                <ShoppingCart className="h-4 w-4" />
                Ingredients
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="px-6 md:px-12 lg:px-24 py-12">
        {section ? <CollectionPage key={section.id} id={section.id} /> : page === 'recipes' ? <RecipesPage /> : <IngredientsPage />}
      </div>

      <footer className="px-6 md:px-12 lg:px-24 py-8 border-t text-sm text-muted-foreground flex flex-wrap gap-x-6 gap-y-2">
        <span>Recipes that aren't meal prep:</span>
        {COLLECTIONS.map(c => (
          <a key={c.id} href={`#${c.id}`} className="underline hover:text-foreground">{c.label}</a>
        ))}
      </footer>
    </div>
  )
}

export default App