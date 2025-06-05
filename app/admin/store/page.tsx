"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8081/admin/medicines";

  // Fetch products (map medicine_id -> id)
  const fetchProducts = async () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAdd = async (product: Product) => {
    setLoading(true);
    try {
      const { id, ...rest } = product; // Don't send id on add
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

  // Update product (now with NO id in payload)
  const handleUpdate = async (product: Product) => {
    setLoading(true);
    try {
      if (!product.id) throw new Error("Product ID is missing.");
      const { id, ...rest } = product; // remove id before sending to backend
      const res = await fetch(`${API_BASE}/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest), // NO id in the body!
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

  // Delete product with enhanced debugging/logging
  const handleDelete = async (id?: number) => {
    if (!id) {
      setStatusMsg({ type: "error", msg: "Product ID missing for delete." });
      return;
    }
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    try {
      console.log("Attempting DELETE for product id:", id);
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const text = await res.text();
      console.log("Delete response status:", res.status);
      console.log("Delete response body:", text);

      if (!res.ok) {
        let errorMsg = "Failed to delete product.";
        // Try to get JSON error message from backend
        try {
          const errorJson = JSON.parse(text);
          if (errorJson?.message) errorMsg = errorJson.message;
        } catch (e) {
          if (text) errorMsg = text;
        }
        setStatusMsg({ type: "error", msg: errorMsg });
        throw new Error("Delete failed: " + errorMsg);
      }

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Store</h1>
        <Button onClick={openAddModal} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <img
              src={product.img_URL || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              className="w-full h-40 object-cover mb-4"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/placeholder.svg?height=300&width=300")
              }
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>generic_name: {product.generic_name}</p>
            <p>Category: {product.category}</p>
            <p>Type: {product.type}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Active Ingredients: {product.active_ingredients ?? "-"}</p>
            <p>Storage Conditions: {product.storage_conditions ?? "-"}</p>
            <p>Prescription: {product.prescription_required ? "Yes" : "No"}</p>
            <div className="flex justify-between mt-4">
              <Button onClick={() => openEditModal(product)} disabled={loading}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(product.id)} disabled={loading}>
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

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
