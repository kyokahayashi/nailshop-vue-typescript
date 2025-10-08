import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CheckoutPayload, Order, OrderItem } from '../types'
import type { NailProduct } from '@/modules/nails/types'

export const useOrderStore = defineStore('orders', () => {
  const isProcessing = ref(false)
  const confirmation = ref<Order | null>(null)

  const toOrderItems = (products: Array<{ product: NailProduct; quantity: number }>): OrderItem[] =>
    products.map(({ product, quantity }) => ({
      product,
      quantity,
      lineTotal: product.price * quantity,
    }))

  const submitOrder = async (
    payload: CheckoutPayload,
    products: Array<{ product: NailProduct; quantity: number }>,
  ) => {
    if (!products.length) throw new Error('注文対象が選択されていません。')
    isProcessing.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const items = toOrderItems(products)
      const total = items.reduce((sum, item) => sum + item.lineTotal, 0)
      const order: Order = {
        id: `order_${Date.now()}`,
        items,
        total,
        payload,
        createdAt: new Date().toISOString(),
      }
      confirmation.value = order
      return order
    } finally {
      isProcessing.value = false
    }
  }

  const reset = () => {
    confirmation.value = null
  }

  return {
    isProcessing,
    confirmation,
    submitOrder,
    reset,
  }
})
