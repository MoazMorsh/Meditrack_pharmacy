import type { ReactNode } from "react"
import Link from "next/link"
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
} from "lucide-react"

interface PharmacistLayoutProps {
  children: ReactNode
}

export default function PharmacistLayout({ children }: PharmacistLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md z-10">
        <div className="p-4 border-b">
          <Link href="/pharmacist" className="flex items-center">
            <span className="text-xl font-bold text-blue-600 ml-2">PharmacistHub</span>
          </Link>
        </div>
        <nav className="mt-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/pharmacist" className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacist/store"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                <span>My Store</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacist/branches"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <Building className="w-5 h-5 mr-3" />
                <span>Branches</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacist/orders"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <Clock className="w-5 h-5 mr-3" />
                <span>Orders (Received / Pending)</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacist/missing-medicines"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <MessageSquareWarning className="w-5 h-5 mr-3" />
                <span>Missing Medicines Requests</span>
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacist/suppliers"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <Store className="w-5 h-5 mr-3" />
                <span>Suppliers</span>
              </Link>
            </li>
          </ul>

          <div className="border-t my-4"></div>

          <ul className="space-y-1">
            <li>
              <Link
                href="/pharmacist/settings"
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <button className="text-gray-500 focus:outline-none lg:hidden">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 6H20M4 12H20M4 18H11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center cursor-pointer">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="data:image/png;base64,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"
                    alt="Profile"
                  />
                  <span className="ml-2 text-gray-700">Dr. John Smith</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden">
                  <Link href="/pharmacist/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Profile
                  </Link>
                  <Link href="/pharmacist/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Settings
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}
