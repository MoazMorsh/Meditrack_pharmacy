"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X, Upload, Eye, Trash2, FileText, Calendar, CheckCircle, Clock } from "lucide-react"

interface Prescription {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  dataUrl: string
  uploadDate: string
  patientId: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function BannerTwo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPrescriptionListOpen, setIsPrescriptionListOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const PRESCRIPTIONS_KEY = 'meditrack_prescriptions'

  // Load prescriptions from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(PRESCRIPTIONS_KEY)
    if (stored) {
      setPrescriptions(JSON.parse(stored))
    }
  }, [])

  // Save prescriptions to localStorage
  const savePrescriptions = (newPrescriptions: Prescription[]) => {
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(newPrescriptions))
    setPrescriptions(newPrescriptions)
  }

  // Generate unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Format date for display
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper function to get error message from unknown error
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'Unknown error occurred'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid file type (JPG, PNG, or PDF).')
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size must be less than 10MB.')
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a prescription file first")
      return
    }

    setIsUploading(true)

    // 1) Upload to Cloudinary
    const data = new FormData()
    data.append('file', selectedFile)
    data.append('upload_preset', 'Meditrack')

    let cloudRes
    try {
      cloudRes = await fetch(
        'https://api.cloudinary.com/v1_1/dzj5xj6sq/image/upload',
        { method: 'POST', body: data }
      )
    } catch (err) {
      setIsUploading(false)
      return alert('Network error uploading to Cloudinary.')
    }

    if (!cloudRes.ok) {
      const err = await cloudRes.json()
      console.error('Cloudinary Error:', err)
      setIsUploading(false)
      return alert('Upload to Cloudinary failed.')
    }

    const { secure_url: imageUrl } = await cloudRes.json()
    
    // 2) Call our backend API
    const patientId = localStorage.getItem('userId')
    const token = localStorage.getItem('token') // if you're using JWT auth
    alert(patientId)

    let apiRes
    try {
      apiRes = await fetch('/patient/upload-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ image: imageUrl })
      })
    } catch (err) {
      setIsUploading(false)
      return alert('Network error sending to your API.')
    }

    if (!apiRes.ok) {
      const errorBody = await apiRes.json().catch(() => ({}))
      console.error('API Error:', errorBody)
      console.error('API Status:', apiRes.status)
      console.error('API Status Text:', apiRes.statusText)
      setIsUploading(false)
      return alert(`Failed to save prescription. Status: ${apiRes.status} - ${errorBody.message || apiRes.statusText}`)
    }

    const result = await apiRes.json()
    
    // 3) Store locally as backup (with Cloudinary URL)
    const newPrescription: Prescription = {
      id: result.prescriptionId || generateId(),
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      dataUrl: imageUrl, // Use Cloudinary URL
      uploadDate: new Date().toISOString(),
      patientId: patientId || 'local-user',
      status: 'pending'
    }

    // Add to local prescriptions array
    const updatedPrescriptions = [newPrescription, ...prescriptions]
    savePrescriptions(updatedPrescriptions)
    
    alert(result.message || 'Prescription uploaded!')
    
    // Clear input
    setSelectedFile(null)
    const fileInput = document.getElementById("fileInput") as HTMLInputElement
    if (fileInput) fileInput.value = ''
    
    setIsUploading(false)
  }

  const handleDeletePrescription = (id: string) => {
    if (confirm('Are you sure you want to delete this prescription?')) {
      const updatedPrescriptions = prescriptions.filter(p => p.id !== id)
      savePrescriptions(updatedPrescriptions)
    }
  }

  const handleViewImage = (dataUrl: string) => {
    setSelectedImageUrl(dataUrl)
    setIsImageModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <section id="banner-two" className="bg-fros-blue bg-opacity-90 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Upload prescription"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-white text-2xl font-medium mb-8">
              Order with prescription, Upload prescription and we will deliver your medicine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                variant="outline"
                className="bg-white text-fros-blue hover:bg-gray-100"
                onClick={() => setIsModalOpen(true)}
              >
                Learn More
              </Button>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*, .pdf"
                    onChange={handleFileChange}
                    className="mb-2 border-2 border-light-blue rounded-lg p-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-light-blue file:text-white hover:file:bg-light-blue/90"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mb-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="bg-light-blue text-white hover:bg-light-blue/90 flex-1" 
                    onClick={handleUpload}
                    disabled={isUploading || !selectedFile}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200"
                    onClick={() => setIsPrescriptionListOpen(true)}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="ml-1">({prescriptions.length})</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">How to Upload Your Prescription</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <ol className="list-decimal pl-5 space-y-2 mt-4">
            <li>Click the 'Upload' button.</li>
            <li>Select your prescription file from your device.</li>
            <li>Make sure the image is clear and readable.</li>
            <li>Submit the file and wait for confirmation.</li>
            <li>Wait for approval from Admin and Confirm the order.</li>
          </ol>
        </DialogContent>
      </Dialog>

      {/* Prescriptions List Modal */}
      <Dialog open={isPrescriptionListOpen} onOpenChange={setIsPrescriptionListOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Your Prescriptions ({prescriptions.length})</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          
          <div className="mt-4">
            {prescriptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No prescriptions uploaded yet</p>
                <p className="text-sm">Upload your first prescription to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{prescription.fileName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(prescription.uploadDate)}
                          </span>
                          <span>{(prescription.fileSize / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(prescription.status)}`}>
                        {getStatusIcon(prescription.status)}
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </div>
                    </div>

                    {prescription.fileType.startsWith('image/') && (
                      <div className="mb-3">
                        <img
                          src={prescription.dataUrl}
                          alt="Prescription preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleViewImage(prescription.dataUrl)}
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {prescription.fileType.startsWith('image/') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewImage(prescription.dataUrl)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Full Size
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeletePrescription(prescription.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Prescription Image</DialogTitle>
            <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="mt-4">
            <img
              src={selectedImageUrl}
              alt="Prescription full size"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}