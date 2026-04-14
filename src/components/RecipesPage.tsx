import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeDetail } from '@/components/RecipeDetail'
import { X } from '@phosphor-icons/react'
import { loadRecipes } from '@/lib/recipes'
import type { Recipe, RecipeCategory } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'All'>('All')
  const [selectedRating, setSelectedRating] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedPortions, setSelectedPortions] = useState<string>('all')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    loadRecipes().then(loadedRecipes => {
      setRecipes(loadedRecipes)
      setLoading(false)
    })
  }, [])

  const filteredRecipes = recipes.filter(recipe => {
    if (selectedCategory !== 'All' && recipe.category !== selectedCategory) return false
    if (selectedRating !== 'all' && recipe.rating !== parseInt(selectedRating)) return false
    if (selectedDifficulty !== 'all' && recipe.difficulty !== selectedDifficulty) return false
    if (selectedPortions !== 'all' && recipe.portions !== parseInt(selectedPortions)) return false
    return true
  })

  const hasActiveFilters = selectedRating !== 'all' || selectedDifficulty !== 'all' || selectedPortions !== 'all'

  const clearFilters = () => {
    setSelectedRating('all')
    setSelectedDifficulty('all')
    setSelectedPortions('all')
  }

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setDetailOpen(true)
  }

  const uniquePortions = Array.from(new Set(recipes.map(r => r.portions))).sort((a, b) => a - b)

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Browse by Category</h2>
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as RecipeCategory | 'All')}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="All" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
              All Recipes
            </TabsTrigger>
            <TabsTrigger value="Chicken" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-medium">
              Chicken
            </TabsTrigger>
            <TabsTrigger value="Ground Beef" className="data-[state=active]:bg-terracotta data-[state=active]:text-white font-medium">
              Ground Beef
            </TabsTrigger>
            <TabsTrigger value="Steak" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
              Steak
            </TabsTrigger>
            <TabsTrigger value="Other" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-medium">
              Other
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator className="my-8" />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Filter Recipes</h3>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Rating</label>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger>
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any rating</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="3">3 stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any difficulty</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Portions</label>
            <Select value={selectedPortions} onValueChange={setSelectedPortions}>
              <SelectTrigger>
                <SelectValue placeholder="Any portions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any portions</SelectItem>
                {uniquePortions.map(portions => (
                  <SelectItem key={portions} value={portions.toString()}>
                    {portions} {portions === 1 ? 'portion' : 'portions'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading recipes...
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No recipes match your criteria</p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <RecipeCard 
                    recipe={recipe} 
                    onClick={() => handleRecipeClick(recipe)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <RecipeDetail 
        recipe={selectedRecipe}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
