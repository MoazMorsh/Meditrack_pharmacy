import PharmacistSidebar from "@/components/pharmacist/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash, MapPin, Phone, Mail, Globe, Calendar } from "lucide-react"

export default function Branches() {
  // Sample branches data
  const branches = [
    {
      id: 1,
      name: "Downtown Pharmacy",
      branchId: "BR-1001",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      email: "downtown@pharmacy.com",
      website: "www.pharmacy.com/downtown",
      location: "Latitude: 40.7128, Longitude: -74.0060",
      created: "2023-01-15",
    },
    {
      id: 2,
      name: "Uptown Pharmacy",
      branchId: "BR-1002",
      address: "456 High Street, Uptown",
      phone: "(555) 987-6543",
      email: "uptown@pharmacy.com",
      website: "www.pharmacy.com/uptown",
      location: "Latitude: 40.8224, Longitude: -73.9496",
      created: "2023-02-20",
    },
    {
      id: 3,
      name: "Westside Pharmacy",
      branchId: "BR-1003",
      address: "789 West Avenue, Westside",
      phone: "(555) 456-7890",
      email: "westside@pharmacy.com",
      website: "www.pharmacy.com/westside",
      location: "Latitude: 40.7831, Longitude: -73.9712",
      created: "2023-03-10",
    },
    {
      id: 4,
      name: "Eastside Pharmacy",
      branchId: "BR-1004",
      address: "321 East Boulevard, Eastside",
      phone: "(555) 234-5678",
      email: "eastside@pharmacy.com",
      website: "www.pharmacy.com/eastside",
      location: "Latitude: 40.7614, Longitude: -73.9776",
      created: "2023-04-05",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PharmacistSidebar />

      <div className="flex-1 p-8 md:ml-64">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Branches</h1>
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <span className="mx-2">/</span>
            <span>My Branches</span>
          </div>
        </div>

        <Button className="mb-6 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id} className="overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b">{branch.name}</h3>
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span>{branch.address}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span>{branch.phone}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span>{branch.email}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">
                      <Globe className="h-4 w-4" />
                    </span>
                    <span>{branch.website}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <span>Created: {branch.created}</span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1">
                    <Trash className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
