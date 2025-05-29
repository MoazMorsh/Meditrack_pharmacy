"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// This would normally come from a chart library like recharts
// For simplicity, we're using a placeholder
const ChartPlaceholder = () => (
  <div className="w-full h-[300px] bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg relative overflow-hidden">
    <div className="absolute bottom-0 left-0 w-full h-[60%]">
      <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,150 L0,100 C50,80 100,50 150,60 C200,70 250,90 300,80 C350,70 400,30 450,40 L500,50 L500,150 Z"
          className="fill-blue-500/50"
        ></path>
      </svg>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-[40%]">
      <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,150 L0,120 C50,100 100,80 150,90 C200,100 250,120 300,110 C350,100 400,60 450,70 L500,80 L500,150 Z"
          className="fill-blue-500/30"
        ></path>
      </svg>
    </div>
  </div>
)

export default function SalesChart() {
  const [timeframe, setTimeframe] = useState("weekly")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Sales Report</CardTitle>
          <CardDescription>
            {timeframe === "daily" && "Sales for today"}
            {timeframe === "weekly" && "Sales for this week"}
            {timeframe === "monthly" && "Sales for this month"}
            {timeframe === "yearly" && "Sales for this year"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeframe("daily")}>Daily</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("weekly")}>Weekly</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("monthly")}>Monthly</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeframe("yearly")}>Yearly</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ChartPlaceholder />
      </CardContent>
    </Card>
  )
}
