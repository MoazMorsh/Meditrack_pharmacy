"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Analytics() {
  const [chartLoaded, setChartLoaded] = useState(false)
  const salesChartRef = useRef<HTMLCanvasElement>(null)
  const productsChartRef = useRef<HTMLCanvasElement>(null)
  const demographicsChartRef = useRef<HTMLCanvasElement>(null)
  const salesTypeChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJs = async () => {
      try {
        const Chart = (await import("chart.js/auto")).default

        // Register required components
        Chart.register({
          id: "datalabels",
          beforeDraw: (chart: any) => {
            const ctx = chart.ctx
            ctx.save()
            ctx.fillStyle = chart.options.plugins?.backgroundColor || "rgba(255, 255, 255, 0.7)"
            ctx.fillRect(0, 0, chart.width, chart.height)
            ctx.restore()
          },
        })

        // Initialize charts
        initializeCharts(Chart)
        setChartLoaded(true)
      } catch (error) {
        console.error("Failed to load Chart.js:", error)
      }
    }

    loadChartJs()

    return () => {
      // Cleanup charts on component unmount
      if (chartLoaded) {
        const chartInstances = [
          salesChartRef.current,
          productsChartRef.current,
          demographicsChartRef.current,
          salesTypeChartRef.current,
        ]

        chartInstances.forEach((instance) => {
          if (instance && (instance as any).__chartInstance) {
            ;(instance as any).__chartInstance.destroy()
          }
        })
      }
    }
  }, [])

  const initializeCharts = (Chart: any) => {
    // Sales Performance Chart
    if (salesChartRef.current) {
      new Chart(salesChartRef.current, {
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
            legend: {
              position: "top",
            },
            title: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Revenue ($)",
              },
            },
          },
        },
      })
    }

    // Top Selling Products Chart
    if (productsChartRef.current) {
      new Chart(productsChartRef.current, {
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
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Units Sold",
              },
            },
          },
        },
      })
    }

    // Demographics Chart
    if (demographicsChartRef.current) {
      new Chart(demographicsChartRef.current, {
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
          plugins: {
            legend: {
              position: "right",
            },
          },
        },
      })
    }

    // Prescription vs OTC Sales Chart
    if (salesTypeChartRef.current) {
      new Chart(salesTypeChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Prescription", "OTC"],
          datasets: [
            {
              label: "Sales Distribution",
              data: [65, 35],
              backgroundColor: ["rgba(59, 130, 246, 0.7)", "rgba(16, 185, 129, 0.7)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Orders</h3>
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">1,245</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Products Sold</h3>
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">3,892</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Revenue</h3>
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">$12,543</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">+15% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Performance</h3>
            <select className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1">
              <option value="week">This Week</option>
              <option value="month" selected>
                This Month
              </option>
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
            <select className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1">
              <option value="all">All Categories</option>
              <option value="prescription">Prescription</option>
              <option value="otc">OTC</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
          <div className="h-64">
            <canvas ref={productsChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Demographics</h3>
            <select className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1">
              <option value="age">By Age</option>
              <option value="gender">By Gender</option>
              <option value="location">By Location</option>
            </select>
          </div>
          <div className="h-64">
            <canvas ref={demographicsChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Prescription vs OTC Sales</h3>
            <select className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1">
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

      {/* Inventory Alerts */}
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
