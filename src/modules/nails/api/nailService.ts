import axios from 'axios'
import { mockNails } from '../data/mockNails'
import type { CreateNailPayload, NailProduct, UpdateNailPayload } from '../types'

const STORAGE_KEY = 'nailshop:nails'
const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `nail_${Math.random().toString(36).slice(2, 11)}`
}

const loadFromStorage = (): NailProduct[] => {
  if (typeof window === 'undefined') {
    return clone(mockNails)
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNails))
    return clone(mockNails)
  }

  try {
    const parsed = JSON.parse(raw) as NailProduct[]
    return parsed.length ? parsed : clone(mockNails)
  } catch (error) {
    console.warn('Failed to parse local storage nails, falling back to mock data.', error)
    return clone(mockNails)
  }
}

const persistToStorage = (data: NailProduct[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

let localCache: NailProduct[] = loadFromStorage()

const useRemoteApi = Boolean(API_BASE_URL)

export const nailService = {
  async fetchAll(): Promise<NailProduct[]> {
    if (useRemoteApi) {
      try {
        const { data } = await axios.get<NailProduct[]>(`${API_BASE_URL}/nails`)
        return data
      } catch (error) {
        console.warn('Falling back to local cache for nail data.', error)
      }
    }
    return clone(localCache)
  },

  async fetchById(id: string): Promise<NailProduct | undefined> {
    if (useRemoteApi) {
      try {
        const { data } = await axios.get<NailProduct>(`${API_BASE_URL}/nails/${id}`)
        return data
      } catch (error) {
        console.warn(`Unable to fetch remote nail ${id}, using local cache.`, error)
      }
    }
    return clone(localCache.find((item) => item.id === id))
  },

  async create(payload: CreateNailPayload): Promise<NailProduct> {
    if (useRemoteApi) {
      const { data } = await axios.post<NailProduct>(`${API_BASE_URL}/nails`, payload)
      return data
    }

    const newProduct: NailProduct = {
      ...payload,
      id: createId(),
      createdAt: new Date().toISOString(),
    }

    localCache = [newProduct, ...localCache]
    persistToStorage(localCache)
    return clone(newProduct)
  },

  async update(id: string, payload: UpdateNailPayload): Promise<NailProduct> {
    if (useRemoteApi) {
      const { data } = await axios.put<NailProduct>(`${API_BASE_URL}/nails/${id}`, payload)
      return data
    }

    const index = localCache.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Item not found')
    }

    const updated: NailProduct = {
      ...localCache[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    localCache.splice(index, 1, updated)
    persistToStorage(localCache)
    return clone(updated)
  },

  async remove(id: string): Promise<void> {
    if (useRemoteApi) {
      await axios.delete(`${API_BASE_URL}/nails/${id}`)
      return
    }

    localCache = localCache.filter((item) => item.id !== id)
    persistToStorage(localCache)
  },
}
