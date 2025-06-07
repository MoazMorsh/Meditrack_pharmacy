"use client"

import SalesChart from "@/components/pharmacist/dashboard/sales-chart"
import { ArrowUpRight, ArrowDownRight, Activity, ShoppingBag, Eye, Users } from "lucide-react"

export default function PharmacistDashboard() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Traffic */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">1,500</div>
            <div className="text-gray-500">Traffic</div>
            <div className="flex items-center text-green-600 mt-1 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +40%
            </div>
          </div>
        </div>
        {/* Sales */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">234</div>
            <div className="text-gray-500">Sales</div>
            <div className="flex items-center text-red-600 mt-1 text-sm">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -60%
            </div>
          </div>
        </div>
        {/* Pageviews */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Eye className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">465</div>
            <div className="text-gray-500">Pageviews</div>
            <div className="flex items-center text-green-600 mt-1 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +30%
            </div>
          </div>
        </div>
        {/* Visitors */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Users className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">235</div>
            <div className="text-gray-500">Visitors</div>
            <div className="flex items-center text-green-600 mt-1 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +80%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Sales Overview</h2>
        <SalesChart />
      </div>
    </div>
  )
}
