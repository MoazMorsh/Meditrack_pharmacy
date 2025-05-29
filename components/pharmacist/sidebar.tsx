"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  Store,
  Building2,
  Clock,
  AlertCircle,
  Truck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Change the default export to a named export
export const Sidebar = function PharmacistSidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const menuItems = [
    { path: "/pharmacist", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/pharmacist/store", label: "My Store", icon: <Store className="h-5 w-5" /> },
    { path: "/pharmacist/branches", label: "Branches", icon: <Building2 className="h-5 w-5" /> },
    { path: "/pharmacist/orders", label: "Orders (Received / Pending)", icon: <Clock className="h-5 w-5" /> },
    {
      path: "/pharmacist/missing-medicines",
      label: "Missing Medicines Requests",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    { path: "/pharmacist/suppliers", label: "Suppliers", icon: <Truck className="h-5 w-5" /> },
  ]

  return (
    <>
      {isMobile && (
        <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md">
          {isSidebarOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      )}

      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
        md:translate-x-0 w-64 bg-white border-r border-gray-200 shadow-sm`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <Link href="/pharmacist" className="text-xl font-bold text-primary">
              PharmacistHub
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                  <Home className="h-5 w-5" />
                  <span className="ml-3">Home</span>
                </Link>
              </li>

              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg ${
                      pathname === item.path ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-200">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pharmacist/settings"
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === "/pharmacist/settings" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => console.log("Logout clicked")}
                  className="flex w-full items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 p-3 rounded-lg">
              <Button className="w-full mb-2">Upgrade</Button>
              <p className="text-xs text-gray-500">
                Become a <span className="font-bold">PRO</span> member and enjoy{" "}
                <span className="font-bold">All Features</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// Also keep the default export for backward compatibility
export default Sidebar
