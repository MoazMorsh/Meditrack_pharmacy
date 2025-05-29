"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
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
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem("userId")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")
    const userRole = localStorage.getItem("userRole")
    const userProfilePic = localStorage.getItem("userProfilePic")

    // Redirect if not logged in
    if (!userId || !userRole) {
      showError("Please login to access this page")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    // Set initial values
    setProfileData((prev) => ({
      ...prev,
      username: userName || "",
      email: userEmail || "",
      role: userRole || "patient",
      profile_pic: userProfilePic || "",
    }))

    // Fetch profile data
    fetchProfileData(userId, userRole)
  }, [router])

  const fetchProfileData = async (userId: string, userRole: string) => {
    try {
      setLoading(true)

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      const token = localStorage.getItem("token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`/${userRole.toLowerCase()}/view-profile/${userId}`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }

      const data = await response.json()
      const userData = data.data || data

      setProfileData((prev) => ({
        ...prev,
        age: userData.age || "",
        phone: userData.phone || "",
        address: userData.address || "",
        website: userData.website || "",
        department: userData.department || "",
        level: userData.level || "",
        profile_pic: userData.profile_pic || prev.profile_pic,
      }))
    } catch (error) {
      showError("Failed to load profile data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

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

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "Meditrack")

      const response = await fetch("https://api.cloudinary.com/v1_1/dzj5xj6sq/image/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      const imageUrl = data.secure_url

      // Update profile data
      setProfileData((prev) => ({
        ...prev,
        profile_pic: imageUrl,
      }))

      // Save to database
      const userId = localStorage.getItem("userId")
      const userRole = localStorage.getItem("userRole")
      const token = localStorage.getItem("token")

      if (!userId || !userRole || !token) {
        throw new Error("User data missing")
      }

      const updateResponse = await fetch(`/${userRole.toLowerCase()}/edit-profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_pic: imageUrl }),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile picture")
      }

      // Update localStorage
      localStorage.setItem("userProfilePic", imageUrl)

      showSuccess("Profile picture updated successfully")
    } catch (error) {
      showError("Failed to upload profile picture")
      console.error(error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userId = localStorage.getItem("userId")
    const userRole = localStorage.getItem("userRole")
    const token = localStorage.getItem("token")

    if (!userId || !userRole || !token) {
      showError("User data missing")
      return
    }

    try {
      setLoading(true)

      // Prepare payload based on role
      let payload: Record<string, any> = {}

      if (userRole === "patient") {
        payload = {
          age: profileData.age ? Number.parseInt(profileData.age) : undefined,
          phone: profileData.phone || undefined,
          address: profileData.address || undefined,
        }
      } else if (userRole === "pharmacist") {
        payload = {
          phone: profileData.phone || undefined,
          address: profileData.address || undefined,
          website: profileData.website || undefined,
        }
      } else if (userRole === "admin") {
        payload = {
          department: profileData.department || undefined,
          level: profileData.level || undefined,
        }
      }

      // Filter out undefined values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key]
        }
      })

      if (Object.keys(payload).length === 0) {
        showError("Please fill at least one field to update")
        return
      }

      const response = await fetch(`/${userRole.toLowerCase()}/edit-profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const result = await response.json()

      showSuccess(result.message || "Profile updated successfully")

      // Update localStorage if needed
      if (result.data) {
        Object.entries(result.data).forEach(([key, value]) => {
          if (value !== undefined) {
            localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, value as string)
          }
        })
      }
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h1>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                <Image
                  src={profileData.profile_pic || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                  width={128}
                  height={128}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <Input name="username" value={profileData.username} disabled className="bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input name="email" value={profileData.email} disabled className="bg-gray-100" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Input
                name="role"
                value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Patient Fields */}
            {profileData.role === "patient" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <Input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Textarea name="address" value={profileData.address} onChange={handleInputChange} rows={3} />
                </div>
              </>
            )}

            {/* Pharmacist Fields */}
            {profileData.role === "pharmacist" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <Input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Textarea name="address" value={profileData.address} onChange={handleInputChange} rows={3} />
                </div>
              </>
            )}

            {/* Admin Fields */}
            {profileData.role === "admin" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <Input name="department" value={profileData.department} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <Select value={profileData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                      <SelectTrigger>
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
              </>
            )}

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
    </div>
  )
}
