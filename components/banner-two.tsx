"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

export default function BannerTwo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    // In a real app, you would upload the file to your server here
    alert(`File "${selectedFile.name}" uploaded successfully!`)
    setSelectedFile(null)

    // Reset the file input
    const fileInput = document.getElementById("fileInput") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  return (
    <section id="banner-two" className="bg-fros-blue bg-opacity-90 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <Image
              src="/banner-2.png?height=400&width=400"
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

              <div className="bg-white p-6 rounded-lg">
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*, .pdf"
                  onChange={handleFileChange}
                  className="mb-4 border-2 border-light-blue rounded-lg p-2 w-full"
                />
                <Button className="bg-light-blue text-white hover:bg-light-blue/90 w-full" onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </section>
  )
}
