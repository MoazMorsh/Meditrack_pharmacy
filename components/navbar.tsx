"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profilePicUrl, setProfilePicUrl] = useState("")
  const [userId, setUserId] = useState("")
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Service", href: "/#services" },
    { name: "Quick Order", href: "/#banner-two" },
    { name: "Subscription", href: "/#package-service" },
    { name: "Products", href: "/products" },
    { name: "Cart", href: "/cart" },
    { name: "Contact", href: "/#contact" },
  ]

  const isActive = (path: string) => {
    return pathname === path
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

  useEffect(() => {
    // Get user data from localStorage
    const username = localStorage.getItem("userName")
    const email = localStorage.getItem("userEmail")
    const role = localStorage.getItem("userRole")
    const storedUserId = localStorage.getItem("userId")
    const storedProfilePic = localStorage.getItem("userProfilePic")

    if (storedUserId) {
      setUserId(storedUserId)
      
      // Set profile picture URL directly from localStorage
      if (storedProfilePic && storedProfilePic !== "null" && storedProfilePic !== "") {
        setProfilePicUrl(storedProfilePic)
      } else {
        // Use default image if no profile pic is set
        setProfilePicUrl(defaultProfileImage)
      }
    }

    // Update profile popup if user is logged in
    if (username && email && role) {
      const usernameElement = document.querySelector("#username")
      const emailElement = document.querySelector("#email")
      const roleElement = document.querySelector("#role")
      const profileLink = document.querySelector("#profileLink")
      const profileLinkText = document.querySelector("#profileLinkText")

      if (usernameElement) usernameElement.textContent = username
      if (emailElement) emailElement.textContent = email
      if (roleElement) roleElement.textContent = capitalizeFirstLetter(role)

      // Update profile link based on role
      if (profileLink && profileLinkText) {
        if (role.toLowerCase() === "pharmacist") {
          profileLinkText.textContent = "Pharmacist Panel"
          profileLink.setAttribute("href", "/pharmacist")
        } else if (role.toLowerCase() === "admin") {
          profileLinkText.textContent = "Admin Panel"
          profileLink.setAttribute("href", "/admin")
        } else {
          profileLinkText.textContent = "Order Status"
          profileLink.setAttribute("href", "/order-status")
        }
      }
    }
  }, [isProfileOpen])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const defaultProfileImage = "https://kzvtniajqclodwlokxww.supabase.co/storage/v1/object/sign/images/blue-circle-with-white-user.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5Xzg2ZjA3MzBjLWZjM2ItNGYwYy1iNDc1LWRkZWU1Y2QzYjZhNCJ9.eyJ1cmwiOiJpbWFnZXMvYmx1ZS1jaXJjbGUtd2l0aC13aGl0ZS11c2VyLmpwZyIsImlhdCI6MTc0NjcwNDQ5MywiZXhwIjoxNzc4MjQwNDkzfQ.ws3JY7lQCYwT-DYR-Ni0EWxGiXmOUmG1DnLMj2eBy_M"

  // Listen for profile picture updates
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedProfilePic = localStorage.getItem("userProfilePic")
      if (updatedProfilePic && updatedProfilePic !== "null" && updatedProfilePic !== "") {
        setProfilePicUrl(updatedProfilePic)
      } else {
        setProfilePicUrl(defaultProfileImage)
      }
    }

    // Listen for storage changes (when profile is updated)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <header className="bg-fros-blue sticky top-0 z-50">
      <nav className="py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Update the logo to match the provided image */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white text-2xl font-bold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="16" height="20" x="4" y="2" rx="2" />
                <path d="M9 22v-4h6v4" />
                <circle cx="10" cy="10" r="1" />
                <circle cx="14" cy="10" r="1" />
                <path d="M10 14h4" />
              </svg>
              Meditrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-white opacity-80 font-medium hover:opacity-100 transition-all ${
                  isActive(link.href) ? "opacity-100 font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white hover:bg-blue-600 rounded-full"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Replace the profile button with a more detailed profile popup */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-white hover:bg-blue-600 rounded-full"
                aria-label="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden border-2 border-blue-500">
                  <img
                    id="profileIconImg"
                    src={profilePicUrl || defaultProfileImage}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = defaultProfileImage
                    }}
                  />
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                  <div className="space-y-2">
                    <div id="profilePopup">
                      <a id="profileLink" href="/order-status" className="text-blue-500 flex items-center mb-3">
                        <span id="profileLinkText">Order Status</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </a>
                      <p>
                        <strong>Username:</strong> <span id="username"></span>
                      </p>
                      <p>
                        <strong>Email:</strong> <span id="email"></span>
                      </p>
                      <p>
                        <strong>Role:</strong> <span id="role"></span>
                      </p>

                      <a href="/edit-profile" className="text-blue-500 flex items-center mt-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        <span>Edit Profile</span>
                      </a>

                      <a href="#" onClick={() => logout()} className="text-red-500 flex items-center mt-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        <span>Logout</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/cart">
              <button className="p-2 text-white hover:bg-blue-600 rounded-full relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-light-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white hover:bg-blue-600 rounded-full"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart">
              <button className="p-2 text-white hover:bg-blue-600 rounded-full relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-light-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-blue-600 rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-blue-600">
            <div className="container mx-auto px-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pr-10 bg-white border-light-gray"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-600 bg-white">
            <div className="container mx-auto px-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`block px-3 py-2 rounded-md ${
                        isActive(link.href) ? "bg-fros-blue/10 text-fros-blue" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/account"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}