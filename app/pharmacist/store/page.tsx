import PharmacistSidebar from "@/components/pharmacist/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash } from "lucide-react"

export default function MyStore() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Paracetamol",
      generic: "Acetaminophen",
      category: "Painkillers",
      type: "Tablets",
      price: 5.99,
      quantity: 100,
      prescription: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Vitamin C",
      generic: "Ascorbic Acid",
      category: "Vitamins",
      type: "Capsules",
      price: 8.5,
      quantity: 75,
      prescription: false,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Amoxicillin",
      generic: "Amoxicillin",
      category: "Antibiotics",
      type: "Capsules",
      price: 12.99,
      quantity: 50,
      prescription: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Multivitamin",
      generic: "Multivitamin Complex",
      category: "Vitamins",
      type: "Tablets",
      price: 15.75,
      quantity: 60,
      prescription: false,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PharmacistSidebar />

      <div className="flex-1 p-8 md:ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Store</h1>
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <span className="mx-2">/</span>
            <span>My Store</span>
          </div>
        </div>

        <Button className="mb-6 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-semibold">Generic:</span> {product.generic}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {product.type}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> ${product.price}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span> {product.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Prescription:</span>{" "}
                    {product.prescription ? "Required" : "Not required"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1">
                    <Trash className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
