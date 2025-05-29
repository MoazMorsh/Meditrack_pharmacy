"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Product {
  id: number
  name: string
  generic: string
  category: string
  type: string
  price: number
  quantity: number
  prescription: boolean
  image: string
}

export default function MyStore() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Paracetamol",
      generic: "Acetaminophen",
      category: "Painkillers",
      type: "Tablets",
      price: 5.99,
      quantity: 100,
      prescription: false,
      image: "/placeholder.svg?height=300&width=300",
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
      image: "/placeholder.svg?height=300&width=300",
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
      image: "/placeholder.svg?height=300&width=300",
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
      image: "/placeholder.svg?height=300&width=300",
    },
  ])

  const openAddModal = () => {
    setCurrentProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setCurrentProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentProduct(null)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const newProduct = {
      id: currentProduct ? currentProduct.id : Date.now(),
      name: formData.get("name") as string,
      generic: formData.get("generic") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      price: Number.parseFloat(formData.get("price") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      prescription: formData.has("prescription"),
      image: (formData.get("image") as string) || "/placeholder.svg?height=300&width=300",
    }

    if (currentProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === currentProduct.id ? newProduct : p)))
    } else {
      // Add new product
      setProducts([...products, newProduct])
    }

    closeModal()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Store</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=300&width=300"
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Generic:</strong> {product.generic}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Type:</strong> {product.type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Prescription:</strong> {product.prescription ? "Required" : "Not required"}
              </p>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(product)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center gap-1"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {currentProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name*</Label>
                  <Input id="name" name="name" defaultValue={currentProduct?.name || ""} required />
                </div>

                <div>
                  <Label htmlFor="generic">Generic Name</Label>
                  <Input id="generic" name="generic" defaultValue={currentProduct?.generic || ""} />
                </div>

                <div>
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    name="category"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    defaultValue={currentProduct?.category || ""}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Painkillers">Painkillers</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Supplements">Supplements</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="type">Type*</Label>
                  <select
                    id="type"
                    name="type"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    defaultValue={currentProduct?.type || ""}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="price">Price ($)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={currentProduct?.price || ""}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity*</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    defaultValue={currentProduct?.quantity || ""}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" type="url" defaultValue={currentProduct?.image || ""} />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prescription"
                    name="prescription"
                    defaultChecked={currentProduct?.prescription || false}
                  />
                  <Label htmlFor="prescription">Prescription Required</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">{currentProduct ? "Update" : "Save"}</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
