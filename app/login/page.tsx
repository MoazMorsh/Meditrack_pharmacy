"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Mail, Linkedin, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    role: "",
  })

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSignupForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!loginForm.username || !loginForm.password || !loginForm.role) {
      setMessage({ text: "Please fill out all fields.", type: "error" })
      setIsLoading(false)
      return
    }

    // Here we make an API call to our backend
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.username,
          password: loginForm.password,
          role: loginForm.role.toLowerCase(),
        }),
      })

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Login failed")
        } else {
          const errorText = await response.text()
          throw new Error(errorText || "Login failed with status: " + response.status)
        }
      }

      const data = await response.json()

      // Store user data based on role
      let userId, userEmail, userName, userRole

      if (data.patient) {
        userId = data.patient.id
        userEmail = data.patient.email
        userName = data.patient.username
        userRole = data.patient.role
      } else if (data.pharmacist) {
        userId = data.pharmacist.id
        userEmail = data.pharmacist.email
        userName = data.pharmacist.username
        userRole = data.pharmacist.role
      } else if (data.admin) {
        userId = data.admin.id
        userEmail = data.admin.email
        userName = data.admin.username
        userRole = data.admin.role
      }

      // Store in localStorage
      localStorage.setItem("userId", userId)
      localStorage.setItem("userEmail", userEmail)
      localStorage.setItem("userName", userName)
      localStorage.setItem("userRole", userRole)
      localStorage.setItem("token", data.token || "")

      setMessage({ text: "Login successful! ✅", type: "success" })

      // Redirect based on role
      setTimeout(() => {
        if (userRole === "admin") {
          router.push("/admin")
        } else if (userRole === "pharmacist") {
          router.push("/pharmacist")
        } else {
          router.push("/")
        }
      }, 1500)
    } catch (error: any) {
      console.error("Login error:", error)
      setMessage({ text: error.message || "Login failed. Please try again.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (
      !signupForm.username ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword ||
      !signupForm.role
    ) {
      setMessage({ text: "Please fill out all fields.", type: "error" })
      setIsLoading(false)
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(signupForm.email)) {
      setMessage({ text: "Please enter a valid email.", type: "error" })
      setIsLoading(false)
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" })
      setIsLoading(false)
      return
    }

    if (signupForm.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long.", type: "error" })
      setIsLoading(false)
      return
    }

    // Here we make an API call to our backend
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
          role: signupForm.role.toLowerCase(),
        }),
      })

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Registration failed")
        } else {
          const errorText = await response.text()
          console.error("Non-JSON error response:", errorText)
          throw new Error("Registration failed with status: " + response.status)
        }
      }

      const data = await response.json()
      console.log("Registration successful:", data)

      setMessage({ text: "Signup successful! ✅", type: "success" })

      // Switch to login form after successful signup
      setTimeout(() => {
        setIsSignUp(false)
      }, 1500)
    } catch (error: any) {
      console.error("Signup error:", error)
      setMessage({ text: error.message || "Signup failed. Please try again.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className={`container min-h-screen w-full overflow-hidden relative ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Login Form */}
          <form className={`sign-in-form ${isSignUp ? "" : "active"}`} onSubmit={handleLoginSubmit}>
            <h2 className="title">Sign in</h2>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <Input
                type="text"
                name="username"
                placeholder="Email"
                value={loginForm.username}
                onChange={handleLoginChange}
                className="bg-transparent border-none shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>

            <div className="input-field relative">
              <i className="fas fa-lock"></i>
              <Input
                type={showLoginPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="bg-transparent border-none shadow-none focus-visible:ring-0 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                disabled={isLoading}
              >
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="input-field">
              <i className="fas fa-user-tag"></i>
              <select
                className="styled-select bg-transparent border-none shadow-none focus-visible:ring-0 w-full h-full"
                name="role"
                value={loginForm.role}
                onChange={handleLoginChange}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Patient">Patient</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              className="btn solid w-[150px] h-[49px] bg-[#5995fd] hover:bg-[#4d84e2] rounded-[49px] text-white uppercase font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-icon">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-icon">
                <Mail size={18} />
              </a>
              <a href="#" className="social-icon">
                <Linkedin size={18} />
              </a>
            </div>
          </form>

          {/* Signup Form */}
          <form className={`sign-up-form ${isSignUp ? "active" : ""}`} onSubmit={handleSignupSubmit}>
            <h2 className="title">Sign up</h2>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={signupForm.username}
                onChange={handleSignupChange}
                className="bg-transparent border-none shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={signupForm.email}
                onChange={handleSignupChange}
                className="bg-transparent border-none shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>

            <div className="input-field relative">
              <i className="fas fa-lock"></i>
              <Input
                type={showSignupPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={handleSignupChange}
                className="bg-transparent border-none shadow-none focus-visible:ring-0 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                disabled={isLoading}
              >
                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="input-field relative">
              <i className="fas fa-lock"></i>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupForm.confirmPassword}
                onChange={handleSignupChange}
                className="bg-transparent border-none shadow-none focus-visible:ring-0 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="input-field">
              <i className="fas fa-user-tag"></i>
              <select
                className="styled-select bg-transparent border-none shadow-none focus-visible:ring-0 w-full h-full"
                name="role"
                value={signupForm.role}
                onChange={handleSignupChange}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Patient">Patient</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              className="btn solid w-[150px] h-[49px] bg-[#5995fd] hover:bg-[#4d84e2] rounded-[49px] text-white uppercase font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>

            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-icon">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-icon">
                <Mail size={18} />
              </a>
              <a href="#" className="social-icon">
                <Linkedin size={18} />
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`form-message ${message.type} fixed top-4 left-1/2 transform -translate-x-1/2 z-50 block`}>
          {message.text}
        </div>
      )}

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Enter your personal details and start journey with us!</p>
            <button type="button" className="btn transparent" onClick={() => setIsSignUp(true)} disabled={isLoading}>
              Sign up
            </button>
            <Link href="/">
              <Button className="btn transparent" disabled={isLoading}>
                Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>To keep connected with us please login with your personal info.</p>
            <button type="button" className="btn transparent" onClick={() => setIsSignUp(false)} disabled={isLoading}>
              Sign in
            </button>
            <Link href="/">
              <Button className="btn transparent" disabled={isLoading}>
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
