"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter } from "lucide-react"
import type { Product } from "@/lib/types"

interface SearchFilterProps {
  products: Product[]
  onFilterChange: (filteredProducts: Product[]) => void
}

export function SearchFilter({ products, onFilterChange }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [inStock, setInStock] = useState(false)
  const [prescription, setPrescription] = useState(false)

  const categories = ["all", ...new Set(products.map((product) => product.category))]

  const maxPrice = Math.max(...products.map((product) => product.price))

  useEffect(() => {
    // Initialize price range based on product data
    setPriceRange([0, maxPrice])
  }, [products, maxPrice])

  useEffect(() => {
    // Filter products based on current filter settings
    let filtered = [...products]

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category)
    }

    // Price range filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // In stock filter
    if (inStock) {
      filtered = filtered.filter((product) => product.inStock)
    }

    // Prescription filter
    if (prescription) {
      filtered = filtered.filter((product) => product.requiresPrescription)
    }

    onFilterChange(filtered)
  }, [searchTerm, category, priceRange, inStock, prescription, products, onFilterChange])

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            defaultValue={[0, maxPrice]}
            min={0}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="inStock" checked={inStock} onCheckedChange={(checked) => setInStock(checked as boolean)} />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="prescription"
            checked={prescription}
            onCheckedChange={(checked) => setPrescription(checked as boolean)}
          />
          <Label htmlFor="prescription">Requires Prescription</Label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearchTerm("")
          setCategory("all")
          setPriceRange([0, maxPrice])
          setInStock(false)
          setPrescription(false)
        }}
      >
        <Filter className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  )
}
