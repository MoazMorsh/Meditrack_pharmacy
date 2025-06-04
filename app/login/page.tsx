"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Facebook, Twitter, Linkedin, User, Lock, Users } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !role) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      setLoading(true)
      setError("")

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: role.toLowerCase() }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          throw new Error(data.error || "Invalid credentials")
        } else if (response.status === 422) {
          throw new Error("Validation error. Please check your input.")
        } else {
          throw new Error(data.error || "Login failed. Please try again.")
        }
      }

      const user = data.patient || data.pharmacist || data.admin

      if (!user) {
        throw new Error("Unexpected server response")
      }

      // Save to localStorage
      localStorage.setItem("userId", user.id)
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userName", user.username)
      localStorage.setItem("userRole", user.role)
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "pharmacist":
          router.push("/pharmacist")
          break
        case "patient":
          router.push("/")
          break
        default:
          router.push("/login")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Network or unknown error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Sign in</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Or Sign in with social platforms</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook size={20} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter size={20} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Background */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-600">
        <div className="h-full flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-3xl font-bold mb-6">One of us?</h2>
          <p className="text-lg text-center mb-8">To keep connected with us please login with your personal info.</p>
          <Button variant="outline" className="text-white border-white hover:bg-blue-700" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
