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
  const [uploadStatus, setUploadStatus] = useState("")
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
  const [userInfo, setUserInfo] = useState({
    userId: "",
    userRole: "",
    token: ""
  })

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem("userId")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")
    const userRole = localStorage.getItem("userRole")
    const token = localStorage.getItem("token")
    const userProfilePic = localStorage.getItem("userProfilePic")

    // Redirect if not logged in
    if (!userId || !userRole) {
      showError("Please login to access this page")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    // Set user info for later use
    setUserInfo({
      userId: userId || "",
      userRole: userRole || "",
      token: token || ""
    })

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
        "Accept": "application/json"
      }

      const token = localStorage.getItem("token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Backend URL configuration
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
      const endpoint = `${baseURL}/${userRole.toLowerCase()}/view-profile/${userId}`
      
      console.log('Fetching profile from:', endpoint)
      console.log('Headers:', headers)
      
      const response = await fetch(endpoint, {
        method: "GET",
        headers,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const error = await parseResponse(response)
        throw new Error(error.message || "Failed to fetch profile")
      }

      const data = await response.json()
      console.log('Profile data loaded:', data)
      
      const profileData = data.data || data

      // Update profile data
      setProfileData((prev) => ({
        ...prev,
        age: profileData.age?.toString() || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        website: profileData.website || "",
        department: profileData.department || "",
        level: profileData.level || "",
        profile_pic: profileData.profile_pic || prev.profile_pic,
      }))

      if (profileData.profile_pic) {
        localStorage.setItem("userProfilePic", profileData.profile_pic)
      }
    } catch (error: any) {
      console.error('Profile load error:', error)
      showError(`Failed to load profile: ${extractErrorMessage(error)}`)
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

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setUploadStatus("Uploading...")

    try {
      // 1. Upload to Cloudinary
      const cloudinaryForm = new FormData()
      cloudinaryForm.append("file", file)
      cloudinaryForm.append("upload_preset", "Meditrack")

      const response = await fetch("https://api.cloudinary.com/v1_1/dzj5xj6sq/image/upload", {
        method: "POST",
        body: cloudinaryForm,
      })

      if (!response.ok) throw new Error('Upload to Cloudinary failed')

      const { secure_url } = await response.json()

      // 2. Update profile picture display immediately
      setProfileData((prev) => ({
        ...prev,
        profile_pic: secure_url,
      }))
      setUploadStatus("Upload successful!")

      // 3. Save URL to database
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`
      }

      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
      const dbResponse = await fetch(`${baseURL}/${userInfo.userRole.toLowerCase()}/edit-profile/${userInfo.userId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ profile_pic: secure_url })
      })

      if (!dbResponse.ok) {
        const error = await parseResponse(dbResponse)
        throw new Error(error.message || 'Failed to save to database')
      }

      // 4. Update local storage
      localStorage.setItem('userProfilePic', secure_url)

      // Show success message
      showSuccess('Profile picture updated successfully!')

      // Refresh profile data
      await fetchProfileData(userInfo.userId, userInfo.userRole)

    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadStatus("Upload failed. Please try again.")
      showError(`Error: ${extractErrorMessage(error)}`)
    } finally {
      setUploadingImage(false)
      setTimeout(() => {
        setUploadStatus("")
      }, 3000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userInfo.userId || !userInfo.userRole || !userInfo.token) {
      showError("User authentication data missing")
      return
    }

    try {
      setLoading(true)

      // Prepare update data based on role
      let payload: Record<string, any> = {}

      if (userInfo.userRole.toLowerCase() === "patient") {
        payload = {
          age: profileData.age ? parseInt(profileData.age) : undefined,
          phone: profileData.phone.trim() || undefined,
          address: profileData.address.trim() || undefined,
        }
      } else if (userInfo.userRole.toLowerCase() === "pharmacist") {
        payload = {
          phone: profileData.phone.trim() || undefined,
          address: profileData.address.trim() || undefined,
          website: profileData.website.trim() || undefined,
        }
      } else if (userInfo.userRole.toLowerCase() === "admin") {
        payload = {
          department: profileData.department.trim() || undefined,
          level: profileData.level || undefined,
        }
      }

      // Validate at least one field
      if (Object.values(payload).every(val => val === undefined)) {
        showError('Please fill at least one field to update')
        return
      }

      console.log('Submitting update:', payload)

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`
      }

      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
      const response = await fetch(`${baseURL}/${userInfo.userRole.toLowerCase()}/edit-profile/${userInfo.userId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await parseResponse(response)
        throw new Error(error.message || 'Update failed')
      }

      const result = await response.json()
      console.log('Update successful:', result)

      // Show success and update UI
      showSuccess(result.message || 'Profile updated successfully!')

      // Update localStorage and refresh data
      if (result.data) {
        Object.entries(result.data).forEach(([key, value]) => {
          if (value !== undefined) {
            localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, value as string)
          }
        })
        await fetchProfileData(userInfo.userId, userInfo.userRole)
      }

    } catch (error: any) {
      console.error('Update error:', error)
      showError(`Update failed: ${extractErrorMessage(error)}`)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const parseResponse = async (response: Response) => {
    try {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return await response.json()
      }
      return { message: await response.text() }
    } catch (e) {
      return { message: response.statusText }
    }
  }

  const extractErrorMessage = (error: any) => {
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection.'
    }
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      return 'Server error. Please try again later.'
    }
    if (error.message.startsWith('<!DOCTYPE html>')) {
      return 'Server error occurred'
    }
    return error.message
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(""), 5000)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  // Role-based field rendering
  const renderRoleSpecificFields = () => {
    const role = profileData.role.toLowerCase()

    if (role === "patient") {
      return (
        <div id="patientFields">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <Input
                id="age"
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
              <Input
                id="phone"
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Textarea
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
      )
    }

    if (role === "pharmacist") {
      return (
        <div id="pharmacistFields">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                id="pharmacistPhone"
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <Input
                id="website"
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
            <Textarea
              id="pharmacistAddress"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>
      )
    }

    if (role === "admin") {
      return (
        <div id="adminFields">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <Input
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <Select
                value={profileData.level}
                onValueChange={(value) => setProfileData((prev) => ({ ...prev, level: value }))}
              >
                <SelectTrigger id="level">
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
        </div>
      )
    }

    return null
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
            <div id="errorMessage" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div id="successMessage" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                <Image
                  id="profilePicture"
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
                htmlFor="profilePhoto"
                className="upload-label absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              </label>
              <input
                type="file"
                id="profilePhoto"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
                disabled={uploadingImage}
              />
              {uploadStatus && (
                <div id="uploadStatus" className="text-center text-sm mt-2">
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>

          <form id="profileForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <Input
                  id="username"
                  name="username"
                  value={profileData.username}
                  disabled
                  className="bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  id="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Input
                id="role"
                name="role"
                value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                disabled
                className="bg-gray-100"
                readOnly
              />
            </div>

            {renderRoleSpecificFields()}

            {loading && (
              <div id="loadingIndicator" className="text-center mb-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            )}

            <div className="mt-6">
              <Button id="submitButton" type="submit" className="w-full" disabled={loading}>
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