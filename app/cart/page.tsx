"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Minus, Plus, Trash2, ShoppingBag, MapPin, X } from "lucide-react"
import { cartItems } from "@/lib/data"

export default function CartPage() {
  const [items, setItems] = useState(cartItems)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [addressSet, setAddressSet] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSetDeliveryAddress = () => {
    if (deliveryAddress.trim()) {
      setAddressSet(true)
      setIsDeliveryModalOpen(false)
    } else {
      alert("Please enter a delivery address")
    }
  }

  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    setDeliveryAddress("Current Location (123 Main St)")
    setAddressSet(true)
    setIsDeliveryModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-4">Product</th>
                      <th className="text-center pb-4">Quantity</th>
                      <th className="text-right pb-4">Price</th>
                      <th className="text-right pb-4">Total</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 relative mr-4">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center">
                            <button
                              className="p-1 rounded-full border"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-3">{item.quantity}</span>
                            <button
                              className="p-1 rounded-full border"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <button className="text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Coupon code" />
              </div>
              <Button variant="outline">Apply Coupon</Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Cart Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Delivering to:</span>
                  {addressSet ? (
                    <Button variant="outline" size="sm" onClick={() => setIsDeliveryModalOpen(true)}>
                      Change
                    </Button>
                  ) : (
                    <span className="text-red-500 text-sm">No address set</span>
                  )}
                </div>

                {addressSet ? (
                  <p className="text-gray-700 mb-6">{deliveryAddress}</p>
                ) : (
                  <Button className="w-full mb-6" variant="outline" onClick={() => setIsDeliveryModalOpen(true)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Set Delivery Address
                  </Button>
                )}
              </div>

              <Button className="w-full" disabled={!addressSet}>
                Proceed to Checkout
              </Button>

              <div className="mt-6">
                <h3 className="font-medium mb-2">We Accept:</h3>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Address Modal */}
      <Dialog open={isDeliveryModalOpen} onOpenChange={setIsDeliveryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Set Delivery Address
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Delivery Address:</p>
              <Textarea
                placeholder="Enter your address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={4}
              />
            </div>
            <Button className="w-full" variant="secondary" onClick={handleUseCurrentLocation}>
              <MapPin className="mr-2 h-4 w-4" />
              Use Current Location
            </Button>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsDeliveryModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetDeliveryAddress}>Confirm Address</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
