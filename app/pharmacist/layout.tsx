"use client"

import type { ReactNode } from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LogOut,
  Home,
  LayoutDashboard,
  ShoppingBag,
  Building,
  Clock,
  MessageSquareWarning,
  Store,
  Settings,
  Menu,
  X,
  User,
} from "lucide-react"

interface PharmacistLayoutProps {
  children: ReactNode
}

const navLinks = [
  { name: "Dashboard", href: "/pharmacist", icon: LayoutDashboard },
  { name: "My Store", href: "/pharmacist/store", icon: ShoppingBag },
  { name: "Branches", href: "/pharmacist/branches", icon: Building },
  { name: "Orders (Received / Pending)", href: "/pharmacist/orders", icon: Clock },
  // { name: "Missing Medicines Requests", href: "/pharmacist/missing-medicines", icon: MessageSquareWarning },
  { name: "Pharmacy", href: "/pharmacist/suppliers", icon: Store },
  { name: "Home", href: "/", icon: Home },
]

const bottomNavLinks = [
  { name: "Settings", href: "/pharmacist/settings", icon: Settings },
  // Logout will be handled with a button
]

export default function PharmacistLayout({ children }: PharmacistLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close profile dropdown on click outside
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileOpen])

  const isActive = (path: string) => pathname === path

  const logout = () => {
    // Handle logout (adjust as needed)
    localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0 md:w-20"
        } bg-white transition-all duration-300 ease-in-out overflow-hidden shadow-md z-10`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center p-4 h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <span className={`ml-2 font-bold text-xl text-blue-600 ${!isSidebarOpen && "hidden"}`}>
                PharmacistHub
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
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={`my-4 border-t border-gray-200 ${!isSidebarOpen && "mx-2"}`}></div>
            <ul className="space-y-2 px-2">
              {bottomNavLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>{link.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={logout}
                  className="flex items-center w-full p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
          {/* <div className={`absolute bottom-0 w-64 p-4 border-t bg-gradient-to-r from-blue-500 to-blue-600 text-white ${!isSidebarOpen && "hidden"}`}>
            <Link
              href="#"
              className="block text-center py-2 font-medium rounded-lg border border-white/30 hover:bg-blue-700 transition-colors"
            >
              Upgrade
            </Link>
            <p className="mt-2 text-sm text-center">
              Become a <span className="font-bold">PRO</span> member and enjoy{" "}
              <span className="font-bold">All Features</span>
            </p>
          </div> */}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Profile Dropdown */}
            {/* <div className="flex items-center">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                    src="https://i.pravatar.cc/80?img=6"
                    alt="Profile"
                  />
                  <span className="ml-2 text-gray-700 font-medium hidden md:block">Dr. John Smith</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-4 z-50 animate-fade-in">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">Dr. John Smith</p>
                      <p className="text-sm text-gray-600">pharmacist@hub.com</p>
                      <div className="pt-2 space-y-1">
                        <Link
                          href="/pharmacist/profile"
                          className="flex items-center text-blue-600 hover:underline"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 mr-1" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/pharmacist/settings"
                          className="flex items-center text-blue-600 hover:underline"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center text-red-600 hover:underline"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.18s linear;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  )
}
