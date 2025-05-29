import PharmacistSidebar from "@/components/pharmacist/sidebar"
import StatCard from "@/components/pharmacist/dashboard/stat-card"
import SalesChart from "@/components/pharmacist/dashboard/sales-chart"

export default function PharmacistDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PharmacistSidebar />

      <div className="flex-1 p-8 md:ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <span className="mx-2">/</span>
            <span>Dashboard</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Traffic" value="1500" label="Traffic" percentage={40} trend="up" />
          <StatCard title="Sales" value="234" label="Sales" percentage={60} trend="down" />
          <StatCard title="Pageviews" value="465" label="Pageviews" percentage={30} trend="up" />
          <StatCard title="Visitors" value="235" label="Visitors" percentage={80} trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <SalesChart />
        </div>
      </div>
    </div>
  )
}
