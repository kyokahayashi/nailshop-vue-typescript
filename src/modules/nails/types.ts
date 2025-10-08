export type NailColor = 'ピンク' | 'ブルー' | 'レッド' | 'ニュートラル' | 'ゴールド' | 'ブラック'
export type NailSeason = '春' | '夏' | '秋' | '冬' | 'オールシーズン'
export type NailDesign = 'フラワー' | 'グラデーション' | 'マーブル' | 'シンプル' | 'ビジュ' | 'アート'

export interface NailProduct {
  id: string
  title: string
  description: string
  price: number
  color: NailColor
  season: NailSeason
  design: NailDesign
  image: string
  createdAt: string
  updatedAt?: string
}

export interface NailFilters {
  keyword: string
  colors: NailColor[]
  seasons: NailSeason[]
  designs: NailDesign[]
  priceRange: [number, number]
}

export type CreateNailPayload = Omit<NailProduct, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateNailPayload = Partial<CreateNailPayload>

export const nailColors: NailColor[] = ['ピンク', 'ブルー', 'レッド', 'ニュートラル', 'ゴールド', 'ブラック']
export const nailSeasons: NailSeason[] = ['春', '夏', '秋', '冬', 'オールシーズン']
export const nailDesigns: NailDesign[] = ['フラワー', 'グラデーション', 'マーブル', 'シンプル', 'ビジュ', 'アート']
