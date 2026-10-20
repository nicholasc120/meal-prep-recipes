import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { loadCollection, loadVegetableList, COLLECTIONS, type CollectionId, type CollectionEntry } from '@/lib/collections'

function Macros({ entry, large }: { entry: CollectionEntry; large?: boolean }) {
  if (!entry.calories && !entry.protein) return null
  const items = [
    entry.calories && { value: entry.calories, label: large ? 'Calories' : 'cal' },
    entry.protein && { value: entry.protein, label: 'protein' },
  ].filter(Boolean) as { value: string; label: string }[]
  return (
    <div className={large ? 'flex gap-6 p-4 bg-muted/50 rounded-lg border' : 'flex gap-4 text-sm border-t pt-3'}>
      {items.map(i => (
        <div key={i.label}>
          <span className={large ? 'text-2xl font-bold text-foreground' : 'font-semibold text-foreground'}>{i.value}</span>
          <span className={large ? 'block text-sm text-muted-foreground' : 'text-muted-foreground ml-1'}>{large ? (i.label === 'protein' ? 'Protein' : i.label) : i.label}</span>
        </div>
      ))}
    </div>
  )
}

export function CollectionPage({ id }: { id: CollectionId }) {
  const [entries, setEntries] = useState<CollectionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string | null>(null)
  const info = COLLECTIONS.find(c => c.id === id)!

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadCollection(id).then(e => {
      if (cancelled) return
      setEntries(e)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    const read = () => {
      const m = window.location.hash.match(/^#[^/]+\/(.+)$/)
      setSlug(m ? decodeURIComponent(m[1]) : null)
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [id])

  const selected = entries.find(e => e.slug === slug) || null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{info.heading}</h2>
        <p className="text-muted-foreground">{info.blurb}</p>
      </div>

      {id === 'vegetables' && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Vegetables I use</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1 list-disc pl-5">
            {loadVegetableList().map(v => <li key={v}>{v}</li>)}
          </ul>
          <h3 className="text-xl font-semibold mt-8">How I cook them</h3>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : entries.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(entry => (
            <Card
              key={entry.slug}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              onClick={() => { window.location.hash = `${id}/${encodeURIComponent(entry.slug)}` }}
            >
              <CardHeader>
                <CardTitle className="text-xl leading-tight">{entry.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {entry.description && <p className="text-sm text-muted-foreground">{entry.description}</p>}
                <Macros entry={entry} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selected}
        onOpenChange={open => {
          if (!open) window.location.hash = id
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && <Macros entry={selected} large />}
          {selected && (
            <div className="recipe-content pb-6" dangerouslySetInnerHTML={{ __html: selected.content }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
