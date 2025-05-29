"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import Link from "next/link"

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    role: "",
    age: "",
    phone: "",
    address: "",
    website: "",
    department: "",
    level: "",
    profile_pic: "",
  })

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem("userId")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")
    const userRole = localStorage.getItem("userRole")
    const userProfilePic = localStorage.getItem("userProfilePic")

    // Set initial values
    setProfileData((prev) => ({
      ...prev,
      username: userName || "Admin User",
      email: userEmail || "admin@example.com",
      role: userRole || "admin",
      profile_pic: userProfilePic || "/placeholder.svg?height=128&width=128",
      // Mock data for other fields
      age: "35",
      phone: "+1 (555) 123-4567",
      address: "123 Pharmacy St, Medical District, City, 12345",
      website: "https://meditrack.example.com",
      department: "Administration",
      level: "Senior Manager",
    }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // In a real app, you would upload the image to a server or cloud storage
      // For this example, we'll just create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        const imageUrl = reader.result as string

        // Update profile data
        setProfileData((prev) => ({
          ...prev,
          profile_pic: imageUrl,
        }))

        // Save to localStorage
        localStorage.setItem("userProfilePic", imageUrl)

        showSuccess("Profile picture updated successfully")
        setUploadingImage(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      showError("Failed to upload profile picture")
      console.error(error)
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // In a real app, you would send this data to your backend
      // For this example, we'll just update localStorage

      localStorage.setItem("userName", profileData.username)
      localStorage.setItem("userEmail", profileData.email)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      showSuccess("Profile updated successfully")
    } catch (error) {
      showError("Failed to update profile")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(""), 5000)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Edit Your Profile</h1>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:border-red-700 dark:text-red-100">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 dark:bg-green-900 dark:border-green-700 dark:text-green-100">
            {successMessage}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
              <img
                src={profileData.profile_pic || "/placeholder.svg?height=128&width=128"}
                alt="Profile"
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=128&width=128"
                }}
              />
            </div>
            <label
              htmlFor="profile-picture"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
            >
              {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            </label>
            <input
              type="file"
              id="profile-picture"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
              disabled={uploadingImage}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">
              Role
            </Label>
            <Input
              id="role"
              name="role"
              value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              disabled
              className="bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                Department
              </Label>
              <Input
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="level" className="text-gray-700 dark:text-gray-300">
                Level
              </Label>
              <Select value={profileData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Leader">Team Leader</SelectItem>
                  <SelectItem value="Middle Manager">Middle Manager</SelectItem>
                  <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={profileData.website}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              rows={3}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
