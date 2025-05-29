import PharmacistSidebar from "@/components/pharmacist/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Suppliers() {
  // Sample suppliers data
  const suppliers = [
    {
      id: 1,
      name: "MediSupply Co.",
      contact: "John Smith",
      email: "john@medisupply.com",
      phone: "(555) 123-4567",
      address: "123 Pharma Street, Medical District",
      website: "www.medisupply.com",
      products: 120,
      lastOrder: "2023-05-10",
    },
    {
      id: 2,
      name: "PharmaTech Industries",
      contact: "Sarah Johnson",
      email: "sarah@pharmatech.com",
      phone: "(555) 987-6543",
      address: "456 Health Avenue, Wellness City",
      website: "www.pharmatech.com",
      products: 85,
      lastOrder: "2023-05-15",
    },
    {
      id: 3,
      name: "Global Meds Distribution",
      contact: "Michael Brown",
      email: "michael@globalmeds.com",
      phone: "(555) 456-7890",
      address: "789 Medicine Road, Healthcare Town",
      website: "www.globalmeds.com",
      products: 210,
      lastOrder: "2023-05-08",
    },
    {
      id: 4,
      name: "HealthCare Supplies Inc.",
      contact: "Emily Davis",
      email: "emily@healthcaresupplies.com",
      phone: "(555) 234-5678",
      address: "321 Pharmacy Lane, Medication City",
      website: "www.healthcaresupplies.com",
      products: 150,
      lastOrder: "2023-05-12",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PharmacistSidebar />

      <div className="flex-1 p-8 md:ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <span className="mx-2">/</span>
            <span>Suppliers</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search suppliers..." className="w-[300px] pl-8" />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Supplier</span>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.products}</TableCell>
                    <TableCell>{supplier.lastOrder}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
