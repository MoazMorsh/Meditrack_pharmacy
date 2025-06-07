"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  id: string
  medicine_id: string
  quantity: number
  price: number
}

interface Order {
  id: string
  patient_id: string
  total_price: number
  status: string
  created_at?: string
  order_items?: OrderItem[]
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all orders (can be changed to /pharmacist/orders for pharmacist-specific view)
      const res = await fetch("http://localhost:8081/admin/orders", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data = await res.json()
      setOrders(data)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter
    const matchesSearch =
      searchText.trim() === ""
        ? true
        : order.id.toLowerCase().includes(searchText.toLowerCase()) ||
          (order.patient_id && order.patient_id.toLowerCase().includes(searchText.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  // Approve/Reject handlers
  const handleApprove = async (orderId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/admin/approve-order/${orderId}`, { method: "PUT" })
      if (!res.ok) throw new Error("Approve failed")
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "approved" } : o))
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "approved" })
      }
    } catch (err: any) {
      alert("Failed to approve order: " + (err?.message || ""))
    }
    setActionLoading(false)
  }

  const handleReject = async (orderId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`http://localhost:8081/admin/reject-order/${orderId}`, { method: "PUT" })
      if (!res.ok) throw new Error("Reject failed")
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "rejected" } : o))
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "rejected" })
      }
    } catch (err: any) {
      alert("Failed to reject order: " + (err?.message || ""))
    }
    setActionLoading(false)
  }

  // View modal
  const openModal = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span>Orders</span>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Orders (Received / Pending / Completed)</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-[200px] pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                {/* <SelectItem value="pending_approval">Pending Approval</SelectItem> */}
                {/* <SelectItem value="processing">Processing</SelectItem> */}
                <SelectItem value="approved">Approved</SelectItem>
                {/* <SelectItem value="completed">Completed</SelectItem> */}
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <span>{order.patient_id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(order.status)}`}
                      >
                        {order.status
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openModal(order)}>
                          View
                        </Button>
                        {order.status === "pending_approval" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              disabled={actionLoading}
                              onClick={() => handleApprove(order.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={actionLoading}
                              onClick={() => handleReject(order.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal for Order Details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[95vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Order Details: {selectedOrder.id}
            </h3>
            <div className="mb-2">
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Patient ID:</strong> {selectedOrder.patient_id}
              </span>
              <br />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Status:</strong>{" "}
                <Badge
                  variant="outline"
                  className={`${getStatusColor(selectedOrder.status)}`}
                >
                  {selectedOrder.status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </span>
              <br />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Order Date:</strong>{" "}
                {selectedOrder.created_at
                  ? new Date(selectedOrder.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
              <br />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Total:</strong> ${selectedOrder.total_price?.toFixed(2)}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Order Items</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Medicine ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items?.length ? (
                      selectedOrder.order_items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">{item.medicine_id}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-2">${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-center text-gray-400">No items</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {selectedOrder.status === "pending_approval" && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="default"
                  disabled={actionLoading}
                  onClick={() => handleApprove(selectedOrder.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  disabled={actionLoading}
                  onClick={() => handleReject(selectedOrder.id)}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
