"use client"

import { useState, useEffect } from "react"
import { SearchFilter } from "@/components/search-filter"
import { ProductCard } from "@/components/product-card"
import { CheckoutButton } from "@/components/checkout-button"
import { PrescriptionUpload } from "@/components/prescription-upload"
import { getProducts } from "@/lib/products"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<Product[]>([])

  useEffect(() => {
    // Fetch products
    const fetchedProducts = getProducts()
    setProducts(fetchedProducts)
    setFilteredProducts(fetchedProducts)

    // Get cart items from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  const handleFilterChange = (filtered: Product[]) => {
    setFilteredProducts(filtered)
  }

  const addToCart = (product: Product) => {
    const updatedCart = [...cartItems, product]
    setCartItems(updatedCart)

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <SearchFilter products={products} onFilterChange={handleFilterChange} />
          <PrescriptionUpload />
        </div>

        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products ({filteredProducts.length})</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
              </span>
              <CheckoutButton />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
