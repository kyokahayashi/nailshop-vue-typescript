import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CheckoutPayload, Order } from '../types'
import type { NailProduct } from '@/modules/nails/types'

export const useOrderStore = defineStore('orders', () => {
  const isProcessing = ref(false)
  const confirmation = ref<Order | null>(null)

  const submitOrder = async (payload: CheckoutPayload, items: NailProduct[]) => {
    if (!items.length) throw new Error('注文対象が選択されていません。')
    isProcessing.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const total = items.reduce((sum, item) => sum + item.price, 0)
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
