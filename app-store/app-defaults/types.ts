import {IProductCategory} from '../types'

export interface IAuthor {
  id: number
  firstname: string
  lastname: string
  img: string
}
export interface IBlog {
  _id: string
  title: string
  slug: {
    current: string
  }
  body: string
  short_desc: string
  publishedAt: Date
}

export interface IFAQ {
  _id: string
  question: string
  category: string
  answer: any[] // Portable Text array from Sanity
  order?: number
}

export interface ITestimonial {
  id?: number
  name: string
  description: string
  img: string
  rating: number
}
export interface AppDefaultsState {
  categories?: IProductCategory[]
  searchDefaults?
}

export interface IDates {
  startDate: Date
  endDate: Date
  key?: string
}

export interface IDocument {
  id?: number
  user_id?: number
  file_name?: string
  type: number
  size: number
  file_type: string
  document_name?: string
  verified?: boolean
  verified_by?: string
  document_id?: string
  document_data?
  client_id?: string
  address_id?: number
  document_type: string
  front?: string
  back?: string
  url?: string
  side: 'front' | 'back'
  preview?: string
}

export interface ISearchLocation {
  city?: string
}

export interface IDefaultSearch {
  location?: {
    city?: string
  }
  dates?: IDates
}
