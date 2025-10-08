import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useNailStore } from '@/modules/nails/stores/useNailStore'

const flushAll = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useNailStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads mock products and exposes facets', async () => {
    const store = useNailStore()
    await store.loadProducts()
    expect(store.items.length).toBeGreaterThan(0)
    expect(store.colorFacets.length).toBeGreaterThan(0)
    expect(store.seasonFacets.length).toBeGreaterThan(0)
    expect(store.designFacets.length).toBeGreaterThan(0)
  })

  it('filters products by keyword', async () => {
    const store = useNailStore()
    await store.loadProducts()
    store.updateFilters({ keyword: '春色' })
    await flushAll()
    expect(store.filteredItems.every((item) => item.title.includes('春') || item.description.includes('春'))).toBe(true)
  })
})
