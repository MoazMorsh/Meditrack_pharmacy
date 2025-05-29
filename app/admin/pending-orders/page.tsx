"use client"

import { useState, useEffect } from "react"
import { User, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  user: string
  date: string
  status: string
  items: OrderItem[]
  total: number
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export default function PendingOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate fetching orders from API
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/orders?status=pending')
        // const data = await response.json()

        // Mock data
        const mockOrders = [
          {
            id: "ORD-1234",
            user: "John Doe",
            date: "01-10-2023",
            status: "Pending",
            items: [
              { id: "ITEM-1", name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
              { id: "ITEM-2", name: "Vitamin C", quantity: 1, price: 8.5 },
            ],
            total: 20.48,
          },
          {
            id: "ORD-5678",
            user: "Jane Smith",
            date: "01-11-2023",
            status: "Pending",
            items: [
              { id: "ITEM-3", name: "Amoxicillin", quantity: 1, price: 12.99 },
              { id: "ITEM-4", name: "Multivitamin", quantity: 1, price: 15.75 },
            ],
            total: 28.74,
          },
          {
            id: "ORD-9012",
            user: "Robert Johnson",
            date: "01-12-2023",
            status: "Pending",
            items: [
              { id: "ITEM-5", name: "Ibuprofen", quantity: 1, price: 6.99 },
              { id: "ITEM-6", name: "First Aid Kit", quantity: 1, price: 24.99 },
            ],
            total: 31.98,
          },
          {
            id: "ORD-3456",
            user: "Emily Davis",
            date: "01-13-2023",
            status: "Pending",
            items: [{ id: "ITEM-7", name: "Blood Pressure Monitor", quantity: 1, price: 49.99 }],
            total: 49.99,
          },
          {
            id: "ORD-7890",
            user: "Michael Wilson",
            date: "01-14-2023",
            status: "Pending",
            items: [
              { id: "ITEM-8", name: "Allergy Relief Spray", quantity: 1, price: 11.99 },
              { id: "ITEM-9", name: "Hand Sanitizer", quantity: 3, price: 3.99 },
            ],
            total: 23.96,
          },
        ]

        setOrders(mockOrders)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)))

    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pending Orders</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Orders</h2>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => viewOrderDetails(order)}>
                      View
                    </Button>
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "Processing")}>
                      Process
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Details: {selectedOrder.id}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Customer:</strong> {selectedOrder.user}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Date:</strong> {selectedOrder.date}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong>
                  <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Order Items</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Total:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button onClick={() => updateOrderStatus(selectedOrder.id, "Processing")}>Process Order</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
