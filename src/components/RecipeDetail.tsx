import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import { Star, ChartBar, Users, Clock } from '@phosphor-icons/react'
import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RecipeDetailProps {
  recipe: Recipe | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecipeDetail({ recipe, open, onOpenChange }: RecipeDetailProps) {
  const isMobile = useIsMobile()

  if (!recipe) return null

  const categoryColors: Record<string, string> = {
    Chicken: 'bg-accent text-accent-foreground',
    'Ground Beef': 'bg-terracotta text-white',
    Steak: 'bg-primary text-primary-foreground',
    Other: 'bg-secondary text-secondary-foreground'
  }

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-secondary text-secondary-foreground',
    Medium: 'bg-accent/20 text-accent-foreground border border-accent',
    Hard: 'bg-destructive/20 text-destructive border border-destructive'
  }

  const content = (
    <>
      <div className="space-y-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn('rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wider', categoryColors[recipe.category])}>
            {recipe.category}
          </Badge>
          {recipe.original && (
            <Badge variant="outline" className="rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wider border-primary text-primary">
              Original
            </Badge>
          )}
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn('h-5 w-5', i < recipe.rating ? 'fill-current' : 'opacity-30')}
                weight={i < recipe.rating ? 'fill' : 'regular'}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ChartBar className="h-5 w-5" />
            <Badge variant="outline" className={cn('font-normal', difficultyColors[recipe.difficulty])}>
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-5 w-5" />
            <span>{recipe.portions} {recipe.portions === 1 ? 'portion' : 'portions'}</span>
          </div>
          {(recipe.prepTime || recipe.cookTime) && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-5 w-5" />
              <span>
                {recipe.prepTime && recipe.cookTime 
                  ? `${recipe.prepTime} + ${recipe.cookTime}`
                  : recipe.prepTime || recipe.cookTime}
              </span>
            </div>
          )}
        </div>

        {(recipe.calories || recipe.protein) && (
          <div className="flex gap-6 p-4 bg-muted/50 rounded-lg border">
            {recipe.calories && (
              <div>
                <div className="text-2xl font-bold text-foreground">{recipe.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
            )}
            {recipe.protein && (
              <div>
                <div className="text-2xl font-bold text-foreground">{recipe.protein}</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div 
        className="recipe-content pb-6"
        dangerouslySetInnerHTML={{ __html: recipe.content }}
      />
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">{recipe.title}</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{recipe.title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
