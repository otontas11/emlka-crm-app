// User Types
export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user' | 'agent'
  avatar?: string
  phone?: string
  createdAt?: string
}

// Property Types
export interface Property {
  id: number
  title: string
  description: string
  type: 'sale' | 'rent'
  category: 'apartment' | 'villa' | 'office' | 'land' | 'commercial'
  price: number
  currency: 'TRY' | 'USD' | 'EUR'
  area: number
  rooms?: string
  bathrooms?: number
  floor?: number
  location: Location
  images: string[]
  features: string[]
  status: 'available' | 'sold' | 'rented' | 'pending'
  createdAt: string
  updatedAt: string
  agentId?: number
}

export interface Location {
  city: string
  district: string
  neighborhood?: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// Customer Types
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  type: 'buyer' | 'seller' | 'tenant' | 'landlord'
  budget?: {
    min: number
    max: number
    currency: string
  }
  preferences?: {
    propertyType: string[]
    locations: string[]
    features: string[]
  }
  notes?: string
  assignedAgent?: number
  createdAt: string
  updatedAt: string
}

// Lead Types
export interface Lead {
  id: number
  name: string
  email?: string
  phone: string
  propertyId?: number
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: 'website' | 'phone' | 'email' | 'referral' | 'other'
  assignedAgent?: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface PropertyFilters {
  type?: 'sale' | 'rent'
  category?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  district?: string
  minArea?: number
  maxArea?: number
  rooms?: string
}
