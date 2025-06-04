"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  role: string
  profilePic?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")
    const userEmail = localStorage.getItem("userEmail")
    const userRole = localStorage.getItem("userRole")
    const userProfilePic = localStorage.getItem("userProfilePic")

    if (userId && userName && userEmail && userRole) {
      setUser({
        id: userId,
        username: userName,
        email: userEmail,
        role: userRole,
        profilePic: userProfilePic || undefined,
      })
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string) => {
    try {
      setLoading(true)

      // This would be a real API call in a production app
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password, role })
      // })

      // if (!response.ok) {
      //   throw new Error("Login failed")
      // }

      // const data = await response.json()

      // Mock successful login
      const mockUser = {
        id: "user123",
        username: email.split("@")[0],
        email,
        role,
      }

      // Store user data in localStorage
      localStorage.setItem("userId", mockUser.id)
      localStorage.setItem("userName", mockUser.username)
      localStorage.setItem("userEmail", mockUser.email)
      localStorage.setItem("userRole", mockUser.role)
      localStorage.setItem("token", "mock-jwt-token")

      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userProfilePic")
    localStorage.removeItem("token")

    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)

    // Update localStorage
    if (userData.username) localStorage.setItem("userName", userData.username)
    if (userData.email) localStorage.setItem("userEmail", userData.email)
    if (userData.role) localStorage.setItem("userRole", userData.role)
    if (userData.profilePic) localStorage.setItem("userProfilePic", userData.profilePic)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
