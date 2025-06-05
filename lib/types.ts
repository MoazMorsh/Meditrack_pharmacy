export interface Product {
  img_URL: string
  brand(brand: any): unknown
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewCount: number
  discount: number
  inStock: boolean
}

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  quantity: number
}
