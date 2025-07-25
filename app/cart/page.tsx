"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Minus, Plus, Trash2, ShoppingBag, MapPin, X, CreditCard, CheckCircle } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useState } from "react"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [delivery_address, setdelivery_address] = useState("")
  const [addressSet, setAddressSet] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState("")
  const [locLoading, setLocLoading] = useState(false)
  // Card & Order States
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardError, setCardError] = useState("")
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState("")

  // 1. Get patientId of logged-in user from localStorage
  let patientId = null
  if (typeof window !== "undefined") {
    patientId = localStorage.getItem("userId")
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 5.99
  const discountAmount = subtotal * discount
  const tax = (subtotal - discountAmount) * 0.08
  const total = subtotal - discountAmount + shipping + tax

  const handleSetdelivery_address = () => {
    if (delivery_address.trim()) {
      setAddressSet(true)
      setIsDeliveryModalOpen(false)
    } else {
      alert("Please enter a delivery address")
    }
  }

  // Geolocation API with OpenStreetMap reverse geocoding
  const handleUseCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          const displayAddress =
            data.display_name ||
            `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
          setdelivery_address(displayAddress)
          setAddressSet(true)
          setIsDeliveryModalOpen(false)
        } catch (err) {
          setdelivery_address(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`)
          setAddressSet(true)
          setIsDeliveryModalOpen(false)
        }
        setLocLoading(false)
      },
      (error) => {
        setLocLoading(false)
        alert("Unable to fetch current location.")
      }
    )
  }

  // Coupon logic: "SAVE10" gives 10% off
  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1)
      setCouponMsg("Coupon applied! You saved 10%.")
    } else if (coupon.trim() === "") {
      setDiscount(0)
      setCouponMsg("")
    } else {
      setDiscount(0)
      setCouponMsg("Invalid coupon code.")
    }
  }

  // Payment and order submission logic
  const handlePay = async () => {
    // Card validation
    if (
      cardNumber.replace(/\s/g, '').length !== 16 ||
      !expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) ||
      cvc.length !== 3
    ) {
      setCardError("Please enter valid card details.")
      return
    }
    setCardError("")
    setOrderLoading(true)
    setOrderError("")

    // Send ALL fields, including those for your DB
    const items = cart.map(item => ({
      medicine_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))

    try {
      // 2. Use logged-in user id as patient_id in the request
      const response = await fetch("http://localhost:8081/patient/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId, // updated to use logged-in user's id!
          items,
          delivery_address: delivery_address,
          shipping,
          tax,
          discount: discount,
          total_price: total
        }),
      })

      if (!response.ok) {
        throw new Error("Order submission failed")
      }

      setIsPaymentSuccess(true)
      clearCart()
    } catch (err) {
      setOrderError("Order failed, please try again.")
      console.error(err)
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      {cart.length === 0 ? (
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
                    {cart.map((item) => (
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
                          <button className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleApplyCoupon(); }}
                />
                {couponMsg && (
                  <div className={`mt-2 text-sm ${discount ? "text-green-600" : "text-red-600"}`}>{couponMsg}</div>
                )}
              </div>
              <Button variant="outline" onClick={handleApplyCoupon}>Apply Coupon</Button>
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
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ${discountAmount.toFixed(2)}</span>
                  </div>
                )}
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
                  <p className="text-gray-700 mb-6">{delivery_address}</p>
                ) : (
                  <Button className="w-full mb-6" variant="outline" onClick={() => setIsDeliveryModalOpen(true)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Set Delivery Address
                  </Button>
                )}
              </div>
              <Button className="w-full" disabled={!addressSet} onClick={() => setIsCheckoutModalOpen(true)}>
                Proceed to Checkout
              </Button>
              <div className="mt-6">
                <h3 className="font-medium mb-2">We Accept:</h3>
                <div className="flex gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Mada_Logo.svg" alt="Mada" className="h-6" />
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
                value={delivery_address}
                onChange={(e) => setdelivery_address(e.target.value)}
                rows={4}
              />
            </div>
            <Button className="w-full" variant="secondary" onClick={handleUseCurrentLocation} disabled={locLoading}>
              <MapPin className="mr-2 h-4 w-4" />
              {locLoading ? "Detecting..." : "Use Current Location"}
            </Button>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsDeliveryModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetdelivery_address}>Confirm Address</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Gateway Modal with Card Form */}
      <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Checkout
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {!isPaymentSuccess ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="text-xl font-semibold mb-2">Pay {`$${total.toFixed(2)}`}</div>
              <form
                className="w-full space-y-4"
                onSubmit={e => {
                  e.preventDefault()
                  handlePay()
                }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={e => {
                      // Auto-format: add space every 4 digits
                      let val = e.target.value.replace(/\D/g, '').slice(0, 16)
                      val = val.replace(/(.{4})/g, '$1 ').trim()
                      setCardNumber(val)
                      setCardError("")
                    }}
                    required
                    inputMode="numeric"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-medium">Expiry</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2)
                        setExpiry(val)
                        setCardError("")
                      }}
                      required
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-medium">CVC</label>
                    <Input
                      type="text"
                      placeholder="CVC"
                      maxLength={3}
                      value={cvc}
                      onChange={e => {
                        setCvc(e.target.value.replace(/\D/g, '').slice(0,3))
                        setCardError("")
                      }}
                      required
                      inputMode="numeric"
                    />
                  </div>
                </div>
                {cardError && <div className="text-red-600 text-sm">{cardError}</div>}
                <Button className="w-full mt-2" type="submit" disabled={orderLoading}>
                  {orderLoading ? "Processing..." : "Pay Now"}
                </Button>
                {orderError && <div className="text-red-600 text-sm mt-2">{orderError}</div>}
              </form>
              <div className="flex gap-2 mt-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-7" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-7" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-7" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Mada_Logo.svg" alt="Mada" className="h-7" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
              <div className="text-lg font-semibold mb-2">Payment Successful!</div>
              <div className="text-gray-600 mb-6">Thank you for your order.</div>
              <Button asChild>
                <Link href="/products">Back to Shop</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
