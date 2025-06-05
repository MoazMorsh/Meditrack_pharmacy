"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { ProductFilter } from "@/components/product-filter"
import { useCart } from "@/components/cart-context"

const API_BASE = "http://localhost:8081/admin/medicines"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const { cart, addToCart } = useCart()
  const [allCategories, setAllCategories] = useState<string[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const PRODUCTS_PER_PAGE = 12

  // Fetch products and categories from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_BASE)
        if (!res.ok) throw new Error("Network response was not ok")
        const data = await res.json()
        const mapped = data.map((item: any) => ({
          ...item,
          id: item.medicine_id,
          img_URL: item.img_URL, // assuming image is directly in the response
          rating: item.rating || 0,
          reviewCount: item.review_count || 0,
          // add other fields as needed
        }))
        setProducts(mapped)

        // Find most common categories, sorted by usage
        const freq: Record<string, number> = {}
        mapped.forEach((p: { category: string | number }) => {
          if (p.category) freq[p.category] = (freq[p.category] || 0) + 1
        })
        const categoriesSorted = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .map(([cat]) => cat)
        setAllCategories(categoriesSorted)
      } catch (err) {
        setStatusMsg({ type: "error", msg: "Failed to fetch medicines." })
        console.error("Failed to fetch medicines:", err)
      }
    }
    fetchProducts()
  }, [])

  // Reset pagination on filter/search
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategories, selectedRating, priceRange, search, sortBy])

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
        if (selectedRating && product.rating < selectedRating) return false
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false
        if (search && !product.name?.toLowerCase().includes(search.toLowerCase()) &&
          !product.description?.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "low-high": return a.price - b.price
          case "high-low": return b.price - a.price
          case "rating": return b.rating - a.rating
          case "newest": return b.id - a.id
          default: return 0
        }
      })
  }, [
    products,
    selectedCategories,
    selectedRating,
    priceRange,
    search,
    sortBy,
  ])

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  // Filter/Cart handlers
  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  const handleRating = (value: number) => setSelectedRating((r) => (r === value ? null : value))
  const handleSlider = (val: [number, number]) => setPriceRange(val)
  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRating(null)
    setPriceRange([0, 100])
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      {statusMsg && (
        <div className={`mb-4 p-3 rounded ${statusMsg.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {statusMsg.msg}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <ProductFilter
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={toggleCategory}
            selectedRating={selectedRating}
            onRatingChange={handleRating}
            priceRange={priceRange}
            onPriceChange={handleSlider}
            onClear={clearFilters}
          />
        </div>
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-48">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="border border-gray-300 rounded-md p-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                inCart={!!cart.find((item) => item.id === product.id)}
              />
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded border"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-fros-blue text-white' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
