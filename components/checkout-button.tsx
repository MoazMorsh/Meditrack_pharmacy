"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, CreditCard, MapPin, Truck, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function CheckoutButton() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const router = useRouter()
  const { toast } = useToast()

  // Form states
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  const handleDeliveryInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (step === 1) {
      // Validate delivery info
      if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode || !deliveryInfo.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all delivery information fields",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate payment info if card is selected
      if (paymentMethod === "card") {
        if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiry || !paymentInfo.cvv) {
          toast({
            title: "Missing Information",
            description: "Please fill in all payment information fields",
            variant: "destructive",
          })
          return
        }
      }
      handleCheckout()
    }
  }

  const handleCheckout = async () => {
    setLoading(true)

    try {
      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
      const userId = localStorage.getItem("userId")

      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to complete your order",
          variant: "destructive",
        })
        setLoading(false)
        setOpen(false)
        router.push("/login")
        return
      }

      if (cartItems.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Add items before checkout.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Format items for the API
      const items = cartItems.map((item: any) => ({
        medicine_id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      }))

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: userId,
          items,
          delivery_address: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}`,
          phone: deliveryInfo.phone,
          payment_method: paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      // Clear cart
      localStorage.removeItem("cart")

      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and is being processed.",
      })

      // Close dialog and redirect to order status page
      setOpen(false)
      router.push("/order-status")
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your order by providing delivery and payment information.</DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-medium">Delivery Information</h3>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryInfoChange}
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleDeliveryInfoChange}
                    placeholder="New York"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={deliveryInfo.postalCode}
                    onChange={handleDeliveryInfoChange}
                    placeholder="10001"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CreditCard className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-medium">Payment Method</h3>
            </div>

            <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInfoChange}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentInfoChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      value={paymentInfo.expiry}
                      onChange={handlePaymentInfoChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInfoChange}
                      placeholder="123"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="cash" className="pt-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Pay with cash when your order is delivered. Our delivery person will collect the payment.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter>
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} className="mr-auto">
              Back
            </Button>
          )}
          <Button onClick={handleNextStep} disabled={loading}>
            {loading ? (
              <>Loading...</>
            ) : step === 1 ? (
              <>Next</>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Complete Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
