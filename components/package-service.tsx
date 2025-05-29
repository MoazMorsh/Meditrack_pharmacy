"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Phone, Calendar, MessageCircle, X } from "lucide-react"

export default function PackageService() {
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handlePayment = () => {
    alert("Payment Successful! Thank you for subscribing.")
    setIsPaymentModalOpen(false)
  }

  const packages = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Case",
      description:
        "Exclusive priority support for Plus Members. Instant access, seamless assistance, and dedicated care whenever you need it.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Timely Case",
      description: "Reliable, scheduled medicine deliveries for chronic conditions—on time, every time.",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat Case",
      description: "Instant chat support for Plus Members—fast, reliable, and always here for you.",
    },
  ]

  return (
    <section id="package-service" className="bg-fros-blue py-20 text-center">
      <div className="container mx-auto px-4">
        <div className="text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">Package Service</h2>
          <p className="text-xl mb-6">
            Become a +PLUS member
            <br />
            Save flat 5% discount & enjoy free delivery with plus Membership
          </p>
          <Button
            className="bg-light-blue text-white hover:bg-light-blue/90"
            onClick={() => setIsSubscribeModalOpen(true)}
          >
            Subscribe
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-[86px] h-[86px] bg-light-blue text-white rounded-2xl rounded-br-none rotate-45 flex items-center justify-center">
                <div className="-rotate-45">{pkg.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mt-16 mb-6 opacity-70">{pkg.title}</h3>
              <p className="text-sm text-dark-gray mb-8">{pkg.description}</p>
              <Button className="bg-fros-blue text-white hover:bg-fros-blue/90">Read More</Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isSubscribeModalOpen} onOpenChange={setIsSubscribeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Subscribe to Our Pharmacy</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="mt-4">
            <p className="mb-6">
              Get access to exclusive medical content, special offers, and the latest pharmacy updates, Also get your
              based Medicines monthly Automatically.
              <br />
              <br />
              Subscription fee: <strong>100 EGP per month</strong>.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setIsSubscribeModalOpen(false)
                setIsPaymentModalOpen(true)
              }}
            >
              Confirm Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Payment Details</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p>Please complete your payment to activate your subscription.</p>
            <Input type="text" placeholder="Card Number" className="w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="Expiry Date (MM/YY)" />
              <Input type="text" placeholder="CVV" />
            </div>
            <Button className="w-full" onClick={handlePayment}>
              Pay 100 EGP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
