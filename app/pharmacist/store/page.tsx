"use client";

import React, { useEffect, useState } from "react";
import PharmacistSidebar from "@/components/pharmacist/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const API_BASE = "http://localhost:8081/admin/medicines";

interface Product {
  id?: number;
  name: string;
  generic_name: string;
  category: string;
  type: string;
  price: number;
  quantity: number;
  prescription_required: boolean;
  img_URL: string | null;
  active_ingredients?: string | null;
  storage_conditions?: string | null;
}

export default function MyStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      const mapped = data.map((item: any) => ({
        ...item,
        id: item.medicine_id,
      }));
      setProducts(mapped);
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Failed to fetch medicines." });
      console.error("Failed to fetch medicines:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAdd = async (product: Product) => {
    setLoading(true);
    try {
      const { id, ...rest } = product;
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!res.ok) throw new Error("Add failed");
      setStatusMsg({ type: "success", msg: "Product added successfully!" });
      await fetchProducts();
      closeModal();
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Failed to add product." });
      console.error("Add error:", err);
    }
    setLoading(false);
  };

  // Update product
  const handleUpdate = async (product: Product) => {
    setLoading(true);
    try {
      if (!product.id) throw new Error("Product ID is missing.");
      const { id, ...rest } = product;
      const res = await fetch(`${API_BASE}/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!res.ok) throw new Error("Update failed");
      setStatusMsg({ type: "success", msg: "Product updated successfully!" });
      await fetchProducts();
      closeModal();
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Failed to update product." });
      console.error("Update error:", err);
    }
    setLoading(false);
  };

  // Delete product
  const handleDelete = async (id?: number) => {
    if (!id) {
      setStatusMsg({ type: "error", msg: "Product ID missing for delete." });
      return;
    }
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStatusMsg({ type: "success", msg: "Product deleted successfully!" });
      await fetchProducts();
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Failed to delete product." });
      console.error("Delete error:", err);
    }
    setLoading(false);
  };

  // Handle form submit (add or update)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const getOrNull = (key: string) => {
      const value = formData.get(key);
      if (value === null || value === undefined) return null;
      if (typeof value === "string" && value.trim() === "") return null;
      return value;
    };

    const newProduct: Product = {
      id: currentProduct?.id,
      name: formData.get("name") as string,
      generic_name: formData.get("generic_name") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      price: parseFloat(formData.get("price") as string),
      quantity: parseInt(formData.get("quantity") as string, 10),
      prescription_required: formData.get("prescription_required") === "on",
      img_URL: getOrNull("img_URL") as string | null,
      active_ingredients: getOrNull("active_ingredients") as string | null,
      storage_conditions: getOrNull("storage_conditions") as string | null,
    };

    currentProduct ? handleUpdate(newProduct) : handleAdd(newProduct);
  };

  const openAddModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  // Auto-hide status message
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PharmacistSidebar />

      {/* Main content area: fills remaining width */}
      <div className="flex-1 p-8 md:ml-64 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center">My Store</h1>
          <div className="flex items-center text-sm text-gray-500 justify-center">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <span className="mx-2">/</span>
            <span>My Store</span>
          </div>
        </div>

        {/* Add Product button: centered */}
        <div className="flex justify-center mb-6">
          <Button className="flex items-center gap-2" onClick={openAddModal} disabled={loading}>
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>

        {/* Product cards grid: Fills available width */}
        <div
          className="grid gap-6 w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="rounded-2xl shadow-md border bg-white overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 flex flex-col"
            >
              <img
                src={product.img_URL || "/placeholder.svg?height=200&width=300"}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "/placeholder.svg?height=200&width=300")
                }
              />
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-semibold">Generic:</span> {product.generic_name}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {product.type}
                  </p>
                  <p>
                    <span className="font-semibold">Active Ingredients:</span>{" "}
                    {product.active_ingredients ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Storage Conditions:</span>{" "}
                    {product.storage_conditions ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> $
                    {product.price?.toFixed(2) ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span> {product.quantity ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Prescription:</span>{" "}
                    {product.prescription_required ? "Required" : "Not required"}
                  </p>
                </div>
                <div className="flex justify-between mt-auto pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => openEditModal(product)}
                    disabled={loading}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDelete(product.id)}
                    disabled={loading}
                  >
                    <Trash className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-400">No products found.</div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-lg max-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </button>
            </div>
            {/* Make the form scrollable */}
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 overflow-y-auto"
              style={{ maxHeight: "70vh" }}
            >
              <div>
                <Label>Name</Label>
                <Input name="name" defaultValue={currentProduct?.name || ""} required />
              </div>
              <div>
                <Label>generic_name</Label>
                <Input name="generic_name" defaultValue={currentProduct?.generic_name || ""} required />
              </div>
              <div>
                <Label>Category</Label>
                <Input name="category" defaultValue={currentProduct?.category || ""} required />
              </div>
              <div>
                <Label>Type</Label>
                <Input name="type" defaultValue={currentProduct?.type || ""} required />
              </div>
              <div>
                <Label>Active Ingredients</Label>
                <Input name="active_ingredients" defaultValue={currentProduct?.active_ingredients ?? ""} />
              </div>
              <div>
                <Label>Storage Conditions</Label>
                <Input name="storage_conditions" defaultValue={currentProduct?.storage_conditions ?? ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input name="price" type="number" step="0.01" defaultValue={currentProduct?.price || 0} required />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input name="quantity" type="number" defaultValue={currentProduct?.quantity || 0} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  name="prescription_required"
                  defaultChecked={currentProduct?.prescription_required}
                />
                <Label>Prescription Required</Label>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input name="img_URL" defaultValue={currentProduct?.img_URL ?? ""} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : currentProduct ? "Update" : "Add"} Product
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Status message */}
      {statusMsg && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg 
            ${statusMsg.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {statusMsg.msg}
        </div>
      )}
    </div>
  );
}
