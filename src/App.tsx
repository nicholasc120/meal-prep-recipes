import { Toaster } from '@/components/ui/sonner'
import { RecipesPage } from '@/components/RecipesPage'
import { Info } from '@phosphor-icons/react'

function App() {
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
              Macro-Friendly Recipe Collection
            </h1>
            <div className="flex items-start gap-3 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-5">
              <Info className="h-6 w-6 text-primary-foreground flex-shrink-0 mt-0.5" weight="duotone" />
              <div className="text-primary-foreground/95">
                <p className="text-lg leading-relaxed">
                  Every recipe in this collection is carefully crafted to deliver{' '}
                  <span className="font-semibold">500-600 calories</span> with at least{' '}
                  <span className="font-semibold">40 grams of protein</span> per serving.
                  Perfect for hitting your macro targets without sacrificing flavor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 py-12">
        <RecipesPage />
      </div>

      <footer className="mt-16 py-8 border-t bg-muted/30">
        <div className="px-6 md:px-12 lg:px-24 text-center text-sm text-muted-foreground">
          <p>Add your own recipes by placing markdown files in the <code className="bg-muted px-2 py-1 rounded">/public/recipes</code> folder</p>
        </div>
      </footer>
    </div>
  )
}

export default App