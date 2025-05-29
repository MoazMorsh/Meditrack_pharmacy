"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  username: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (userData: any) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")
    const userRole = localStorage.getItem("userRole")

    if (userId && userEmail && userName && userRole) {
      setUser({
        id: userId,
        email: userEmail,
        username: userName,
        role: userRole,
      })
    }

    setLoading(false)
  }, [])

  const login = (userData: any) => {
    // Extract user data based on role
    let userId, userEmail, userName, userRole

    if (userData.patient) {
      userId = userData.patient.id
      userEmail = userData.patient.email
      userName = userData.patient.username
      userRole = userData.patient.role
    } else if (userData.pharmacist) {
      userId = userData.pharmacist.id
      userEmail = userData.pharmacist.email
      userName = userData.pharmacist.username
      userRole = userData.pharmacist.role
    } else if (userData.admin) {
      userId = userData.admin.id
      userEmail = userData.admin.email
      userName = userData.admin.username
      userRole = userData.admin.role
    }

    // Store in localStorage
    localStorage.setItem("userId", userId)
    localStorage.setItem("userEmail", userEmail)
    localStorage.setItem("userName", userName)
    localStorage.setItem("userRole", userRole)

    // Update state
    setUser({
      id: userId,
      email: userEmail,
      username: userName,
      role: userRole,
    })
  }

  const logout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Clear localStorage
      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("userRole")

      // Update state
      setUser(null)

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
