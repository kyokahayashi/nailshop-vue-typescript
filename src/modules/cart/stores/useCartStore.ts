import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem } from '../types'
import type { NailProduct } from '@/modules/nails/types'

const STORAGE_KEY = 'nailshop:cart'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Failed to parse cart data. Resetting cart.', error)
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCart())
  const lastAddedTitle = ref<string | null>(null)

  const persist = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  const addItem = (product: NailProduct, quantity = 1) => {
    const existing = items.value.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.unshift({
        product: clone(product),
        quantity,
      })
    }
    persist()
    lastAddedTitle.value = product.title
  }

  const removeItem = (productId: string) => {
    items.value = items.value.filter((item) => item.product.id !== productId)
    persist()
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const sanitized = Number.isFinite(quantity) ? Math.floor(quantity) : 0
    if (sanitized <= 0) {
      removeItem(productId)
      return
    }
    const target = items.value.find((item) => item.product.id === productId)
    if (target) {
      target.quantity = sanitized
      persist()
    }
  }

  const clear = () => {
    items.value = []
    persist()
  }

  const itemCount = computed(() =>
    items.value.reduce((total, line) => total + line.quantity, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce((total, line) => total + line.product.price * line.quantity, 0),
  )

  const hasItem = (productId: string) =>
    items.value.some((item) => item.product.id === productId)

  const resetLastAdded = () => {
    lastAddedTitle.value = null
  }

  return {
    items,
    itemCount,
    subtotal,
    lastAddedTitle,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    hasItem,
    resetLastAdded,
  }
})
