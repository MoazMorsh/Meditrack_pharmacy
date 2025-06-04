"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <Button variant="outline" size="sm" className="w-full">
              Clear All Filters
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {["Medications", "Vitamins & Supplements", "Personal Care", "First Aid", "Baby Care"].map(
                  (category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category}`} />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-4">
                <Slider defaultValue={[0, 100]} max={100} step={1} />
                <div className="flex items-center justify-between">
                  <span>$0</span>
                  <span>$100</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Brands</h4>
              <div className="space-y-2">
                {["Johnson & Johnson", "Pfizer", "Bayer", "GlaxoSmithKline", "Novartis"].map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox id={`brand-${brand}`} />
                    <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Ratings</h4>
              <div className="space-y-2">
                {["5 Stars", "4 Stars & Up", "3 Stars & Up", "2 Stars & Up", "1 Star & Up"].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">Showing 1-12 of 36 products</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-48">
                <Input type="text" placeholder="Search products..." />
              </div>
              <select className="border border-gray-300 rounded-md p-2">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="grid" className="mb-6">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md">
                    <div className="w-full md:w-1/4 h-48 relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="w-full md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= product.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                          {product.discount > 0 && (
                            <span className="text-gray-500 text-sm line-through">
                              ${((product.price * 100) / (100 - product.discount)).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button>Add to Cart</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-fros-blue text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
