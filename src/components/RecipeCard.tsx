import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ChartBar, Users, Clock } from '@phosphor-icons/react'
import type { Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
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

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-t-4 hover:border-t-accent hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wider', categoryColors[recipe.category])}>
              {recipe.category}
            </Badge>
            {recipe.original && (
              <Badge variant="outline" className="rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wider border-primary text-primary">
                Original
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn('h-4 w-4', i < recipe.rating ? 'fill-current' : 'opacity-30')}
                weight={i < recipe.rating ? 'fill' : 'regular'}
              />
            ))}
          </div>
        </div>
        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
          {recipe.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ChartBar className="h-4 w-4" />
            <Badge variant="outline" className={cn('font-normal', difficultyColors[recipe.difficulty])}>
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{recipe.portions} {recipe.portions === 1 ? 'portion' : 'portions'}</span>
          </div>
          {(recipe.prepTime || recipe.cookTime) && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>
                {recipe.prepTime && recipe.cookTime 
                  ? `${recipe.prepTime} + ${recipe.cookTime}`
                  : recipe.prepTime || recipe.cookTime}
              </span>
            </div>
          )}
        </div>
        {(recipe.calories || recipe.protein) && (
          <div className="flex gap-4 text-sm border-t pt-3">
            {recipe.calories && (
              <div>
                <span className="font-semibold text-foreground">{recipe.calories}</span>
                <span className="text-muted-foreground ml-1">cal</span>
              </div>
            )}
            {recipe.protein && (
              <div>
                <span className="font-semibold text-foreground">{recipe.protein}</span>
                <span className="text-muted-foreground ml-1">protein</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
