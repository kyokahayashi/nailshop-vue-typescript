import type { NailProduct } from '@/modules/nails/types'

export interface CheckoutPayload {
  name: string
  email: string
  address: string
  note: string
}

export interface OrderItem {
  product: NailProduct
  quantity: number
  lineTotal: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  payload: CheckoutPayload
  createdAt: string
}
