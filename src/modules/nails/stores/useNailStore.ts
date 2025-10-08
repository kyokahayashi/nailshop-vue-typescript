import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { nailService } from '../api/nailService'
import type {
  CreateNailPayload,
  NailFilters,
  NailProduct,
  NailColor,
  NailDesign,
  NailSeason,
  UpdateNailPayload,
} from '../types'

const defaultFilters = (): NailFilters => ({
  keyword: '',
  colors: [],
  seasons: [],
  designs: [],
  priceRange: [0, 5000],
})

export const useNailStore = defineStore('nails', () => {
  const items = ref<NailProduct[]>([])
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const filters = ref<NailFilters>(defaultFilters())
  const selectedProduct = ref<NailProduct | null>(null)

  const loadProducts = async () => {
    isLoading.value = true
    errorMessage.value = null
    try {
      const data = await nailService.fetchAll()
      items.value = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      // Normalize price range to data bounds
      const prices = data.map((item) => item.price)
      if (prices.length) {
        filters.value.priceRange = [Math.min(...prices), Math.max(...prices)]
      }
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : '商品データの取得に失敗しました。'
    } finally {
      isLoading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = defaultFilters()
  }

  const updateFilters = (draft: Partial<NailFilters>) => {
    filters.value = {
      ...filters.value,
      ...draft,
    }
  }

  const filteredItems = computed(() => {
    const keyword = filters.value.keyword.trim().toLowerCase()
    return items.value.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)

      const matchesColor =
        filters.value.colors.length === 0 || filters.value.colors.includes(item.color)

      const matchesSeason =
        filters.value.seasons.length === 0 || filters.value.seasons.includes(item.season)

      const matchesDesign =
        filters.value.designs.length === 0 || filters.value.designs.includes(item.design)

      const matchesPrice =
        item.price >= filters.value.priceRange[0] &&
        item.price <= filters.value.priceRange[1]

      return matchesKeyword && matchesColor && matchesSeason && matchesDesign && matchesPrice
    })
  })

  const colorFacets = computed<NailColor[]>(() =>
    Array.from(new Set(items.value.map((item) => item.color))),
  )
  const seasonFacets = computed<NailSeason[]>(() =>
    Array.from(new Set(items.value.map((item) => item.season))),
  )
  const designFacets = computed<NailDesign[]>(() =>
    Array.from(new Set(items.value.map((item) => item.design))),
  )

  const createProduct = async (payload: CreateNailPayload) => {
    isLoading.value = true
    try {
      const product = await nailService.create(payload)
      items.value = [product, ...items.value]
      return product
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (id: string, payload: UpdateNailPayload) => {
    isLoading.value = true
    try {
      const product = await nailService.update(id, payload)
      items.value = items.value.map((item) => (item.id === id ? product : item))
      selectedProduct.value = null
      return product
    } finally {
      isLoading.value = false
    }
  }

  const removeProduct = async (id: string) => {
    isLoading.value = true
    try {
      await nailService.remove(id)
      items.value = items.value.filter((item) => item.id !== id)
    } finally {
      isLoading.value = false
    }
  }

  const highlightProduct = async (id: string) => {
    if (!id) return
    const product = await nailService.fetchById(id)
    selectedProduct.value = product ?? null
  }

  return {
    items,
    filters,
    isLoading,
    errorMessage,
    selectedProduct,
    filteredItems,
    colorFacets,
    seasonFacets,
    designFacets,
    loadProducts,
    resetFilters,
    updateFilters,
    createProduct,
    updateProduct,
    removeProduct,
    highlightProduct,
  }
})
