import { ArrowUp, ArrowDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  label: string
  percentage: number
  trend: "up" | "down"
}

export default function StatCard({ title, value, label, percentage, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-gray-500">{label}</p>
        </div>
        <div className={`p-2 rounded-full ${trend === "up" ? "bg-green-100" : "bg-red-100"}`}>
          {trend === "up" ? (
            <ArrowUp className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDown className="h-5 w-5 text-red-600" />
          )}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${trend === "up" ? "bg-blue-600" : "bg-blue-600"}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-500">{percentage}%</div>
    </div>
  )
}
