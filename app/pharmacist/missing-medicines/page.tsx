"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MissingMedicines() {
  // Sample missing medicines requests data
  const requests = [
    {
      id: "#MR-1001",
      medicine: "Paracetamol 500mg",
      quantity: "50 boxes",
      requestedBy: "Dr/Abd Elaziz",
      branch: "Downtown Branch",
      date: "2023-05-15",
      status: "pending",
    },
    {
      id: "#MR-1002",
      medicine: "Amoxicillin 250mg",
      quantity: "30 boxes",
      requestedBy: "Dr/Ahmed",
      branch: "6th October Branch",
      date: "2023-05-14",
      status: "processing",
    },
    {
      id: "#MR-1003",
      medicine: "Ibuprofen 200mg",
      quantity: "25 boxes",
      requestedBy: "DR/ Ibrahim",
      branch: "Nasr City Branch",
      date: "2023-05-12",
      status: "completed",
    },
    {
      id: "#MR-1004",
      medicine: "Loratadine 10mg",
      quantity: "40 boxes",
      requestedBy: "DR/ Mohamed",
      branch: "New Cairo Branch",
      date: "2023-05-10",
      status: "rejected",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Missing Medicines Requests</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span>Missing Medicines Requests</span>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          {/* <CardTitle>Missing Medicines Requests</CardTitle> */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search requests..." className="w-[200px] pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.medicine}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{request.branch}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      {request.status === "pending" && (
                        <Button size="sm" variant="default">
                          Process
                        </Button>
                      )}
                      {request.status === "processing" && (
                        <Button size="sm" variant="default">
                          Complete
                        </Button>
                      )}
                      {request.status === "rejected" && (
                        <Button size="sm" variant="outline">
                          Reopen
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
