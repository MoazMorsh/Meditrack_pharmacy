"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Eye, Package, FileText } from "lucide-react"

interface Order {
  id: string
  patientId: string
  totalAmount: number
  status: string
  createdAt: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  productName: string // will be medicine_id for now, can be medicine name if you update backend or fetch names
  quantity: number
  unitPrice: number
  subtotal: number
  createdAt: string
}

interface Prescription {
  id: string
  patientId: string
  status: string
  imageUrl: string
  created_at: string
}

export default function OrderStatusPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("token")

    if (!userId || !token) {
      setError("Please login to view your orders")
      setLoading(false)
      return
    }

    Promise.all([
      fetchOrders(userId, token),
      fetchPrescriptions(userId, token)
    ])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Error fetching data:", err)
        setError("Failed to load your orders and prescriptions")
        setLoading(false)
      })
  }, [])

  // Fetch real orders for this user from your API
  const fetchOrders = async (userId: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:8081/patient/patient-order/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()

      setOrders(
        (data || []).map((order: any) => ({
          id: order.id?.toString(),
          patientId: order.patient_id?.toString(),
          totalAmount: order.total_price || 0,
          status: order.status || "",
          createdAt: order.created_at || order.createdAt || "",
          items: (order.order_items || []).map((item: any) => ({
            id: item.id?.toString(),
            productName: item.medicine_id?.toString(), // If you want to show medicine name, fetch it separately or join in backend
            quantity: item.quantity || 0,
            unitPrice: item.price || 0,
            subtotal: (item.price || 0) * (item.quantity || 0),
            createdAt: order.created_at || "",
          })),
        }))
      )
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  }

  // Fetch ALL pending prescriptions, then filter for this user
  const fetchPrescriptions = async (userId: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/PendingPrescription`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch prescriptions')
      const allPrescriptions = await response.json()

      // Only keep the prescriptions that belong to the logged-in user
      const userPrescriptions = allPrescriptions.filter(
        (prescription: any) => prescription.patientId?.toString() === userId
      )

      setPrescriptions(
        userPrescriptions.map((prescription: any) => ({
          id: prescription.id?.toString(),
          patientId: prescription.patientId?.toString(),
          status: prescription.status || "Pending",
          imageUrl: prescription.image || prescription.imageUrl || "/placeholder.svg?height=400&width=300",
          created_at: prescription.created_at || prescription.createdAt || "",
        }))
      )
    } catch (error) {
      console.error("Error fetching prescriptions:", error)
      throw error
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Loading your orders and prescriptions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Order Status</h1>

      <Tabs defaultValue="orders" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        {/* Orders tab */}
        <TabsContent value="orders">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">You don't have any orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left">Order ID</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Total Amount</th>
                        <th className="px-4 py-3 text-left">Created At</th>
                        <th className="px-4 py-3 text-left">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{order.id}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">${order.totalAmount.toFixed(2)}</td>
                          <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-3">
                            <ul className="list-disc pl-4">
                              {order.items.map(item => (
                                <li key={item.id}>
                                  <span className="font-medium">{item.productName}</span>
                                  {" × "}{item.quantity}{" "}
                                  (${item.unitPrice.toFixed(2)} each)
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Prescriptions tab (unchanged) */}
        <TabsContent value="prescriptions">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Prescriptions</h2>

              {prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">You don't have any prescriptions yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left">Prescription ID</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Uploaded At</th>
                        <th className="px-4 py-3 text-left">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((prescription) => (
                        <tr key={prescription.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{prescription.id}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}
                            >
                              {prescription.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatDate(prescription.created_at)}</td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedImage(prescription.imageUrl)}
                              className="flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Prescription Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prescription Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedImage && (
              <div className="relative w-full h-[500px]">
                <Image src={selectedImage || "/placeholder.svg"} alt="Prescription" fill className="object-contain" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
