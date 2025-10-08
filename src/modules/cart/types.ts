import type { NailProduct } from '@/modules/nails/types'

export interface CartItem {
  product: NailProduct
  quantity: number
}
