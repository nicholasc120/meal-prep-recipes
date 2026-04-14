import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash, ShoppingCart, Barcode } from '@phosphor-icons/react'
import type { Ingredient } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export function IngredientsPage() {
  const [ingredients, setIngredients] = useKV<Ingredient[]>('common-ingredients', [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    window.spark.user().then(user => {
      setIsOwner(user?.isOwner || false)
    })
  }, [])

  const ingredientsList = ingredients || []

  const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    servingSize: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    store: '',
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      servingSize: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      store: '',
      notes: ''
    })
  }

  const handleAddIngredient = () => {
    if (!formData.name || !formData.servingSize || !formData.store) {
      toast.error('Please fill in all required fields')
      return
    }

    const newIngredient: Ingredient = {
      ...formData,
      id: Date.now().toString()
    }

    setIngredients(current => [...(current || []), newIngredient])
    setIsAddDialogOpen(false)
    resetForm()
    toast.success('Ingredient added successfully')
  }

  const handleEditIngredient = () => {
    if (!editingIngredient || !formData.name || !formData.servingSize || !formData.store) {
      toast.error('Please fill in all required fields')
      return
    }

    setIngredients(current =>
      (current || []).map(ing => ing.id === editingIngredient.id ? { ...formData, id: ing.id } : ing)
    )
    setIsEditDialogOpen(false)
    setEditingIngredient(null)
    resetForm()
    toast.success('Ingredient updated successfully')
  }

  const handleDeleteIngredient = (id: string) => {
    setIngredients(current => (current || []).filter(ing => ing.id !== id))
    toast.success('Ingredient deleted')
  }

  const openEditDialog = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setFormData({
      name: ingredient.name,
      servingSize: ingredient.servingSize,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      store: ingredient.store,
      notes: ingredient.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const filteredIngredients = ingredientsList.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ing.store.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Common Ingredients</h2>
          <p className="text-muted-foreground">
            Macro information and sourcing details for ingredients used in these recipes
          </p>
        </div>
        {isOwner && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" size="lg">
                <Plus className="h-5 w-5" />
                Add Ingredient
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Ingredient</DialogTitle>
              <DialogDescription>
                Add a common ingredient with its macros and where you purchase it
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ingredient Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Chicken Breast, Ground Beef"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="servingSize">Serving Size *</Label>
                <Input
                  id="servingSize"
                  placeholder="e.g., 100g, 4oz, 1 cup"
                  value={formData.servingSize}
                  onChange={e => setFormData({ ...formData, servingSize: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={e => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.protein}
                    onChange={e => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.carbs}
                    onChange={e => setFormData({ ...formData, carbs: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fat}
                    onChange={e => setFormData({ ...formData, fat: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store">Store / Brand *</Label>
                <Input
                  id="store"
                  placeholder="e.g., Costco, Trader Joe's, Perdue"
                  value={formData.store}
                  onChange={e => setFormData({ ...formData, store: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this ingredient..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddIngredient}>Add Ingredient</Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search ingredients or stores..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredIngredients.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Barcode className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
            <h3 className="text-xl font-semibold mb-2">No ingredients yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchTerm 
                ? 'No ingredients match your search. Try a different term.' 
                : isOwner 
                  ? 'Start building your ingredient library by adding common items you use in your recipes.'
                  : 'The site owner hasn\'t added any ingredients to the library yet.'}
            </p>
            {!searchTerm && isOwner && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-5 w-5" />
                Add Your First Ingredient
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredIngredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{ingredient.name}</CardTitle>
                        <Badge variant="secondary" className="gap-1.5">
                          <ShoppingCart className="h-3 w-3" />
                          {ingredient.store}
                        </Badge>
                      </div>
                      {isOwner && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(ingredient)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteIngredient(ingredient.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground font-medium">
                      Per {ingredient.servingSize}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">{ingredient.calories}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Calories</div>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{ingredient.protein}g</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Protein</div>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">{ingredient.carbs}g</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Carbs</div>
                      </div>
                      <div className="bg-accent/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-foreground">{ingredient.fat}g</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Fat</div>
                      </div>
                    </div>
                    {ingredient.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground">{ingredient.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Ingredient</DialogTitle>
            <DialogDescription>
              Update the macros and sourcing information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Ingredient Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Chicken Breast, Ground Beef"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-servingSize">Serving Size *</Label>
              <Input
                id="edit-servingSize"
                placeholder="e.g., 100g, 4oz, 1 cup"
                value={formData.servingSize}
                onChange={e => setFormData({ ...formData, servingSize: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-calories">Calories</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={e => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-protein">Protein (g)</Label>
                <Input
                  id="edit-protein"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.protein}
                  onChange={e => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-carbs">Carbs (g)</Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.carbs}
                  onChange={e => setFormData({ ...formData, carbs: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fat">Fat (g)</Label>
                <Input
                  id="edit-fat"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.fat}
                  onChange={e => setFormData({ ...formData, fat: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-store">Store / Brand *</Label>
              <Input
                id="edit-store"
                placeholder="e.g., Costco, Trader Joe's, Perdue"
                value={formData.store}
                onChange={e => setFormData({ ...formData, store: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                placeholder="Any additional notes about this ingredient..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditingIngredient(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditIngredient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
