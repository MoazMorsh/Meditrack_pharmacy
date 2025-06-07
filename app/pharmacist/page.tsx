"use client";

import { useEffect, useState, useRef } from "react";
import {
  ShoppingBag,
  DollarSign,
  Package,
  ArrowUpRight,
} from "lucide-react";
import Chart from "chart.js/auto";

// Edit this for your backend!
const API_ORDERS = "http://localhost:8081/admin/orders";

interface OrderItem {
  quantity: number;
}

interface Order {
  id: number | string;
  total_price: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function PharmacistDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Fetch orders from backend (with fallback and error handling)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_ORDERS);
        if (!res.ok) throw new Error("Failed to fetch orders. Check backend or endpoint!");
        const data = await res.json();

        // Check if array
        if (!Array.isArray(data)) {
          setError("API did not return an array of orders.");
          setOrders([]);
        } else {
          setOrders(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders.");
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Stats Calculations (safe fallback)
  const totalSales = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total_price || 0), 0);
  const totalProductsSold = orders.reduce(
    (acc, order) =>
      acc + (Array.isArray(order.order_items)
        ? order.order_items.reduce((s, i) => s + (i.quantity || 0), 0)
        : 0),
    0
  );

  // Chart: Revenue per month
  useEffect(() => {
    if (!orders.length) return;

    // Prepare data
    const salesByMonth: { [k: string]: number } = {};
    orders.forEach((order) => {
      if (!order.created_at) return;
      const date = new Date(order.created_at);
      if (isNaN(date.getTime())) return;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      salesByMonth[month] = (salesByMonth[month] || 0) + (order.total_price || 0);
    });

    const labels = Object.keys(salesByMonth).sort();
    const values = labels.map((l) => salesByMonth[l]);

    // Draw chart
    const ctx = chartRef.current;
    if (!ctx) return;

    // Cleanup old chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.length > 0 ? labels : ["No data"],
        datasets: [
          {
            label: "Revenue",
            data: values.length > 0 ? values : [0],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Revenue ($)" } },
          x: { title: { display: true, text: "Month" } },
        },
      },
    });
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [orders]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="hidden md:flex items-center text-sm text-gray-500 gap-2">
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <span className="text-gray-700 font-semibold">Dashboard</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{loading ? "..." : totalSales}</div>
            <div className="text-gray-500">Total Orders</div>
            <div className="flex items-center text-green-600 mt-1 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />+15%
            </div>
          </div>
        </div>
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {loading ? "..." : `$${totalRevenue.toLocaleString()}`}
            </div>
            <div className="text-gray-500">Total Revenue</div>
            <div className="flex items-center text-green-600 mt-1 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />+12%
            </div>
          </div>
        </div>
        {/* Products Sold */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{loading ? "..." : totalProductsSold}</div>
            <div className="text-gray-500">Products Sold</div>
            <div className="flex items-center text-green-600 mt-1 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />+10%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Sales Overview</h2>
        {loading && (
          <div className="text-gray-500 mb-2">Loading sales data...</div>
        )}
        {error && (
          <div className="text-red-500 mb-2">{error}</div>
        )}
        <canvas ref={chartRef} height={120}></canvas>
      </div>
    </div>
  );
}

