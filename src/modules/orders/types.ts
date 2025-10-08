import type { NailProduct } from '../nails/types'

export interface CheckoutPayload {
  name: string
  email: string
  address: string
  note: string
}

export interface Order {
  id: string
  items: NailProduct[]
  total: number
  payload: CheckoutPayload
  createdAt: string
}
