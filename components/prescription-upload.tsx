"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Check, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Change the function name and add a named export
export function PrescriptionUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        success: false,
        message: "Please select a prescription file first.",
      })
      return
    }

    setUploading(true)
    setUploadStatus(null)

    // Create FormData for Cloudinary upload
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "Meditrack")

    try {
      // Upload to Cloudinary
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dzj5xj6sq/image/upload", {
        method: "POST",
        body: data,
      })

      if (!cloudRes.ok) {
        const err = await cloudRes.json()
        console.error("Cloudinary Error:", err)
        setUploadStatus({
          success: false,
          message: "Upload to Cloudinary failed.",
        })
        setUploading(false)
        return
      }

      const { secure_url: imageUrl } = await cloudRes.json()
      setImageUrl(imageUrl)

      // Get user ID from localStorage (in a real app, use a more secure method)
      const patientId = localStorage.getItem("userId")
      const token = localStorage.getItem("token")

      // Call backend API
      const apiRes = await fetch("/api/upload-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: imageUrl, patientId }),
      })

      if (!apiRes.ok) {
        const errorBody = await apiRes.json().catch(() => ({}))
        console.error("API Error:", errorBody)
        setUploadStatus({
          success: false,
          message: "Failed to save prescription.",
        })
        setUploading(false)
        return
      }

      const result = await apiRes.json()
      setUploadStatus({
        success: true,
        message: result.message || "Prescription uploaded successfully!",
      })

      // Clear the file input
      setFile(null)
      if (document.getElementById("fileInput") as HTMLInputElement) {
        ;(document.getElementById("fileInput") as HTMLInputElement).value = ""
      }
    } catch (error) {
      console.error("Upload Error:", error)
      setUploadStatus({
        success: false,
        message: "An error occurred during upload.",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium">Upload Prescription</h3>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="fileInput">Prescription Image</Label>
        <Input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
      </div>

      {file && <div className="text-sm text-gray-500 dark:text-gray-400">Selected file: {file.name}</div>}

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading...
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Upload Prescription
          </span>
        )}
      </Button>

      {uploadStatus && (
        <Alert variant={uploadStatus.success ? "default" : "destructive"}>
          {uploadStatus.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{uploadStatus.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{uploadStatus.message}</AlertDescription>
        </Alert>
      )}

      {imageUrl && uploadStatus?.success && (
        <div className="mt-4">
          <Label>Uploaded Prescription</Label>
          <div className="mt-2 border rounded-md overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Uploaded Prescription"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Also keep the default export for backward compatibility
export default PrescriptionUpload
