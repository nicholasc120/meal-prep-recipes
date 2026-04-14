import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { RecipesPage } from '@/components/RecipesPage'
import { IngredientsPage } from '@/components/IngredientsPage'
import { Info, CookingPot, Package } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type Page = 'recipes' | 'ingredients'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('recipes')

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
            <div className="flex items-start gap-3 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-5 mb-6">
              <Info className="h-6 w-6 text-primary-foreground flex-shrink-0 mt-0.5" weight="duotone" />
              <div className="text-primary-foreground/95">
                <p className="text-lg leading-relaxed">
                  Every recipe in this collection is has{' '}
                  <span className="font-semibold">500-600 calories</span> with at least{' '}
                  <span className="font-semibold">40 grams of protein</span> per serving.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                variant={currentPage === 'recipes' ? 'default' : 'secondary'}
                onClick={() => setCurrentPage('recipes')}
                className={cn(
                  'gap-2 transition-all',
                  currentPage === 'recipes' ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30'
                )}
              >
                <CookingPot className="h-5 w-5" weight={currentPage === 'recipes' ? 'fill' : 'regular'} />
                Recipes
              </Button>
              <Button
                size="lg"
                variant={currentPage === 'ingredients' ? 'default' : 'secondary'}
                onClick={() => setCurrentPage('ingredients')}
                className={cn(
                  'gap-2 transition-all',
                  currentPage === 'ingredients' ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30'
                )}
              >
                <Package className="h-5 w-5" weight={currentPage === 'ingredients' ? 'fill' : 'regular'} />
                Ingredients
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 py-12">
        {currentPage === 'recipes' ? <RecipesPage /> : <IngredientsPage />}
      </div>

      <footer className="mt-16 py-8 border-t bg-muted/30">
        <div className="px-6 md:px-12 lg:px-24 text-center text-sm text-muted-foreground">
          <p className="mb-2">Add your own recipes by placing markdown files in the <code className="bg-muted px-2 py-1 rounded">/public/recipes</code> folder</p>
          <p>The ingredients list is curated and maintained by the site owner</p>
        </div>
      </footer>
    </div>
  )
}

export default App