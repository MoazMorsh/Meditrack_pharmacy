"use client"

import { useState, useEffect } from "react"
import { Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Prescription {
  id: string
  patientId: string
  status: string
  image: string
  created_at: string
}

export default function Messages() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching prescriptions from API
    const fetchPrescriptions = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/prescriptions')
        // const data = await response.json()

        // Mock data
        const mockPrescriptions = [
          {
            id: "PRESC-1234",
            patientId: "PATIENT-001",
            status: "Pending",
            image: "/placeholder.svg?height=400&width=300",
            created_at: "2023-05-10T09:15:00Z",
          },
          {
            id: "PRESC-5678",
            patientId: "PATIENT-002",
            status: "Approved",
            image: "/placeholder.svg?height=400&width=300",
            created_at: "2023-05-18T16:20:00Z",
          },
          {
            id: "PRESC-9012",
            patientId: "PATIENT-003",
            status: "Rejected",
            image: "/placeholder.svg?height=400&width=300",
            created_at: "2023-05-20T11:30:00Z",
          },
          {
            id: "PRESC-3456",
            patientId: "PATIENT-004",
            status: "Pending",
            image: "/placeholder.svg?height=400&width=300",
            created_at: "2023-05-22T14:45:00Z",
          },
        ]

        setPrescriptions(mockPrescriptions)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [])

  const viewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPrescription(null)
  }

  const updatePrescriptionStatus = (id: string, newStatus: string) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, status: newStatus } : prescription,
      ),
    )
  }

  const deletePrescription = (id: string) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      setPrescriptions(prescriptions.filter((prescription) => prescription.id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Messages</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Uploaded Prescriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prescription ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prescription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {prescription.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {prescription.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(prescription.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(prescription.status)}`}
                    >
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewPrescription(prescription)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={prescription.status}
                      onChange={(e) => updatePrescriptionStatus(prescription.id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="destructive" size="sm" onClick={() => deletePrescription(prescription.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal */}
      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Prescription Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Patient ID:</strong> {selectedPrescription.patientId}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Prescription ID:</strong> {selectedPrescription.id}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Date:</strong> {formatDate(selectedPrescription.created_at)}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedPrescription.status)}`}
                  >
                    {selectedPrescription.status}
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Prescription Image</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <img
                    src={selectedPrescription.image || "/placeholder.svg"}
                    alt="Prescription"
                    className="max-w-full h-auto mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=400&width=300"
                    }}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button
                  variant={selectedPrescription.status === "Approved" ? "destructive" : "default"}
                  onClick={() => {
                    const newStatus = selectedPrescription.status === "Approved" ? "Rejected" : "Approved"
                    updatePrescriptionStatus(selectedPrescription.id, newStatus)
                    setSelectedPrescription({ ...selectedPrescription, status: newStatus })
                  }}
                >
                  {selectedPrescription.status === "Approved" ? "Reject" : "Approve"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
