"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, RefreshCw, CalendarCheck, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  order_items: OrderItem[]
}

export default function Analytics() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // CHART REFS (not changed)
  const salesChartRef = useRef<HTMLCanvasElement>(null)
  const productsChartRef = useRef<HTMLCanvasElement>(null)
  const demographicsChartRef = useRef<HTMLCanvasElement>(null)
  const salesTypeChartRef = useRef<HTMLCanvasElement>(null)

  // Fetch orders for dynamic stats cards
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("http://localhost:8081/admin/orders")
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  // Only stats cards use real data!
  const totalOrders = orders.length
  const productsSold = orders.reduce(
    (total, order) =>
      total + (order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0),
    0
  )
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)

  // ---- KEEP ALL EXISTING CHARTS LOGIC ----
  useEffect(() => {
    let Chart: any
    let chartInstances: any[] = []

    const loadChartJs = async () => {
      try {
        Chart = (await import("chart.js/auto")).default

        // Sales Performance Chart
        if (salesChartRef.current) {
          const instance = new Chart(salesChartRef.current, {
            type: "line",
            data: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              datasets: [
                {
                  label: "Sales",
                  data: [1200, 1900, 1500, 2000, 2200, 2700, 2400, 2800, 3000, 2900, 3300, 3500],
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  tension: 0.3,
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Revenue ($)" },
                },
              },
            },
          })
          chartInstances.push(instance)
        }

        // Top Selling Products Chart
        if (productsChartRef.current) {
          const instance = new Chart(productsChartRef.current, {
            type: "bar",
            data: {
              labels: ["Paracetamol", "Vitamin C", "Amoxicillin", "Multivitamin", "Ibuprofen"],
              datasets: [
                {
                  label: "Units Sold",
                  data: [450, 380, 320, 280, 250],
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.7)",
                    "rgba(16, 185, 129, 0.7)",
                    "rgba(249, 115, 22, 0.7)",
                    "rgba(139, 92, 246, 0.7)",
                    "rgba(236, 72, 153, 0.7)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Units Sold" },
                },
              },
            },
          })
          chartInstances.push(instance)
        }

        // Demographics Chart
        if (demographicsChartRef.current) {
          const instance = new Chart(demographicsChartRef.current, {
            type: "pie",
            data: {
              labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
              datasets: [
                {
                  label: "Age Distribution",
                  data: [15, 25, 20, 18, 12, 10],
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.7)",
                    "rgba(16, 185, 129, 0.7)",
                    "rgba(249, 115, 22, 0.7)",
                    "rgba(139, 92, 246, 0.7)",
                    "rgba(236, 72, 153, 0.7)",
                    "rgba(245, 158, 11, 0.7)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { position: "right" } },
            },
          })
          chartInstances.push(instance)
        }

        // Prescription vs OTC Sales Chart
        if (salesTypeChartRef.current) {
          const instance = new Chart(salesTypeChartRef.current, {
            type: "doughnut",
            data: {
              labels: ["Prescription", "OTC"],
              datasets: [
                {
                  label: "Sales Distribution",
                  data: [65, 35],
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.7)",
                    "rgba(16, 185, 129, 0.7)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { position: "bottom" } },
            },
          })
          chartInstances.push(instance)
        }
      } catch (error) {
        // If Chart.js fails to load, just skip
        console.error("Failed to load Chart.js:", error)
      }
    }

    loadChartJs()

    // Cleanup on unmount
    return () => {
      chartInstances.forEach((instance) => instance?.destroy())
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
      </div>

      {/* Stats Cards - DYNAMIC! */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading stats...</div>
      ) : error ? (
        <div className="text-red-600 p-4">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <CalendarCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                {totalOrders}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Total Orders</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                {productsSold}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Products Sold</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section - unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Performance</h3>
            <select
                className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
                defaultValue="month"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
            </select>

          </div>
          <div className="h-64">
            <canvas ref={salesChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Selling Products</h3>
            <select
                className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
                defaultValue="month"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
            </select>

          </div>
          <div className="h-64">
            <canvas ref={productsChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Demographics</h3>
            <select
              className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
              defaultValue="month"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

          </div>
          <div className="h-64">
            <canvas ref={demographicsChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Prescription vs OTC Sales</h3>
            <select
              className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
              defaultValue="month"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

          </div>
          <div className="h-64">
            <canvas ref={salesTypeChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Inventory Alerts (unchanged) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Inventory Alerts</h3>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                <span className="text-red-500 font-semibold">Low Stock:</span> Paracetamol 500mg
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Only 12 units left</p>
            </div>
            <Bell className="h-5 w-5 text-red-500" />
          </li>
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                <span className="text-yellow-500 font-semibold">Expiring Soon:</span> Amoxicillin Capsules
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expires in 15 days</p>
            </div>
            <Bell className="h-5 w-5 text-yellow-500" />
          </li>
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                <span className="text-green-500 font-semibold">Restocked:</span> Ibuprofen Tablets
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">200 units added</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  )
}
