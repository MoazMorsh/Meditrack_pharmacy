"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  PieChart,
  MessageSquare,
  Clock,
  Home,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [userData, setUserData] = useState({
    userName: "",
    userEmail: "",
    userRole: "",
  })
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      // Get user data from localStorage
      const userName = localStorage.getItem("userName") || "Admin User"
      const userEmail = localStorage.getItem("userEmail") || "admin@example.com"
      const userRole = localStorage.getItem("userRole") || "admin"

      setUserData({ userName, userEmail, userRole })

      // Check for dark mode preference
      const darkMode = localStorage.getItem("darkMode") === "true"
      setIsDarkMode(darkMode)
      if (darkMode) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", String(newMode))

    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userProfilePic")
    localStorage.removeItem("token")

    // Redirect to login page
    window.location.href = "/login"
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "My Store", href: "/admin/store", icon: ShoppingBag },
    { name: "Analytics", href: "/admin/analytics", icon: PieChart },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Pending Orders", href: "/admin/pending-orders", icon: Clock },
    { name: "Home", href: "/", icon: Home },
  ]

  const bottomNavLinks = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Logout", href: "#", icon: LogOut, onClick: logout },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0 md:w-20"
        } bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden shadow-md z-10`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center p-4 h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className={`ml-2 font-bold text-xl text-gray-800 dark:text-white ${!isSidebarOpen && "hidden"}`}>
                AdminHub
              </span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className={`my-4 border-t border-gray-200 dark:border-gray-700 ${!isSidebarOpen && "mx-2"}`}></div>

            <ul className="space-y-2 px-2">
              {bottomNavLinks.map((link) => (
                <li key={link.name}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                        link.name === "Logout"
                          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>{link.name}</span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        isActive(link.href)
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>{link.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none mr-2"
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfilePopup}
                  className="flex items-center text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {userData.userName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-800 dark:text-white">{userData.userName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{userData.userEmail}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Role:</strong> {capitalizeFirstLetter(userData.userRole)}
                      </p>

                      <div className="pt-2 space-y-2">
                        <Link
                          href="/admin/settings"
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          <span>Edit Profile</span>
                        </Link>

                        <button
                          onClick={logout}
                          className="flex items-center text-red-600 dark:text-red-400 hover:underline"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">{children}</main>
      </div>
    </div>
  )
}
