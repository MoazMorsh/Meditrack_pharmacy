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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/admin/PendingPrescription")
        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.message || "Failed to fetch prescriptions")
        }

        const data = await response.json()
        setPrescriptions(data)
      } catch (err: any) {
        console.error("Error fetching prescriptions:", err)
        setError(err.message || "Unknown error")
      } finally {
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

  const updatePrescriptionStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic UI update
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
      )

      // Send update request to backend
      const response = await fetch(`/admin/UpdatePrescriptionStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }
    } catch (err) {
      console.error("Error updating status:", err)
      alert("Failed to update status. Please try again.")
      // Revert UI update on failure
      setPrescriptions((prev) => [...prev])
    }
  }

  const deletePrescription = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return

    try {
      const response = await fetch(`/admin/DeletePrescription/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete prescription")
      }

      setPrescriptions((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting prescription:", err)
      alert("Failed to delete prescription. Please try again.")
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

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4">
        Error loading prescriptions: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pending Prescriptions</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Uploaded Prescriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prescription ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prescription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{prescription.patientId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{prescription.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(prescription.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="outline" size="sm" onClick={() => viewPrescription(prescription)} className="flex items-center gap-1">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full p-6 relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Prescription for Patient: {selectedPrescription.patientId}</h3>
            <img
              src={selectedPrescription.image}
              alt="Prescription"
              className="w-full max-h-[600px] object-contain rounded"
            />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">Uploaded on: {formatDate(selectedPrescription.created_at)}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Status: {selectedPrescription.status}</p>
          </div>
        </div>
      )}
    </div>
  )
}
