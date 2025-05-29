import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"

export default function FeaturedProducts() {
  // Get only the first 4 products for the featured section
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-gray-600 mt-2">Discover our most popular health and wellness products</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
