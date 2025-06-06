"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-context"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [profilePicUrl, setProfilePicUrl] = useState("")
  const [userId, setUserId] = useState("")
  const [activeSection, setActiveSection] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { cart } = useCart()
  const totalDistinctItems = cart.length

  // Refs for click outside
  const searchBarRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)

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

  const sectionIds = [
    "about",
    "services",
    "banner-two",
    "package-service",
    "contact"
  ]

  // Handle section highlight on scroll
  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/#")) {
      const handleScroll = () => {
        let currentSection = "home"
        const scrollPos = window.scrollY + 80
        for (const id of sectionIds) {
          const section = document.getElementById(id)
          if (section && section.offsetTop <= scrollPos) {
            currentSection = id
          }
        }
        setActiveSection(currentSection)
      }
      window.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      setActiveSection("")
    }
  }, [pathname])

  const isActive = (link: { name?: string; href: string }) => {
    if (link.href.startsWith("/#")) {
      const id = link.href.split("#")[1]
      if (pathname === "/" && activeSection === id) return true
      if (pathname === "/" && id === "home" && activeSection === "home") return true
      return false
    } else {
      return pathname === link.href
    }
  }

  const defaultProfileImage =
    "https://kzvtniajqclodwlokxww.supabase.co/storage/v1/object/sign/images/blue-circle-with-white-user.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5Xzg2ZjA3MzBjLWZjM2ItNGYwYy1iNDc1LWRkZWU1Y2QzYjZhNCJ9.eyJ1cmwiOiJpbWFnZXMvYmx1ZS1jaXJjbGUtd2l0aC13aGl0ZS11c2VyLmpwZyIsImlhdCI6MTc0NjcwNDQ5MywiZXhwIjoxNzc4MjQwNDkzfQ.ws3JY7lQCYwT-DYR-Ni0EWxGiXmOUmG1DnLMj2eBy_M"

  // Populate profile from localStorage
  useEffect(() => {
    const username = localStorage.getItem("userName")
    const email = localStorage.getItem("userEmail")
    const role = localStorage.getItem("userRole")
    const storedUserId = localStorage.getItem("userId")
    const storedProfilePic = localStorage.getItem("userProfilePic")
    if (storedUserId) {
      setUserId(storedUserId)
      if (storedProfilePic && storedProfilePic !== "null" && storedProfilePic !== "") {
        setProfilePicUrl(storedProfilePic)
      } else {
        setProfilePicUrl(defaultProfileImage)
      }
    }
    // Profile values (for rendering in popup)
    setProfileState({
      username: username || "",
      email: email || "",
      role: role || "",
      profileLinkText:
        role?.toLowerCase() === "pharmacist"
          ? "Pharmacist Panel"
          : role?.toLowerCase() === "admin"
          ? "Admin Panel"
          : "Order Status",
      profileLink:
        role?.toLowerCase() === "pharmacist"
          ? "/pharmacist"
          : role?.toLowerCase() === "admin"
          ? "/admin"
          : "/order-status",
    })
  }, [isProfileOpen])

  // Listen for profile pic updates
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedProfilePic = localStorage.getItem("userProfilePic")
      if (updatedProfilePic && updatedProfilePic !== "null" && updatedProfilePic !== "") {
        setProfilePicUrl(updatedProfilePic)
      } else {
        setProfilePicUrl(defaultProfileImage)
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Handle click outside for search bar and profile popup
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isSearchOpen &&
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false)
      }
      if (
        isProfileOpen &&
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }
    if (isSearchOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchOpen, isProfileOpen])

  // Profile info state for popup rendering
  const [profileState, setProfileState] = useState({
    username: "",
    email: "",
    role: "",
    profileLinkText: "Order Status",
    profileLink: "/order-status",
  })

  const logout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userProfilePic")
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  // --- SEARCH HANDLER ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchText.trim()) return
    router.push(`/products?search=${encodeURIComponent(searchText.trim())}`)
    setIsSearchOpen(false)
    setSearchText("")
  }

  return (
    <header className="bg-fros-blue sticky top-0 z-50">
      <nav className="py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
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
                  isActive(link) ? "opacity-100 font-semibold border-b-2 border-white" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {/* Only Search Icon */}
            <button
              className="p-2 text-white hover:bg-blue-600 rounded-full"
              aria-label="Search"
              onClick={() => setIsSearchOpen((v) => !v)}
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Search bar as dropdown/modal */}
            {isSearchOpen && (
              <div
                ref={searchBarRef}
                className="absolute top-12 right-40 z-50 bg-white rounded-lg shadow-lg p-3 w-72"
              >
                <form className="relative" onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pr-10 bg-white border-light-gray"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    type="submit"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </form>
              </div>
            )}
            
            {/* Profile popup */}
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
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).onerror = null
                      e.currentTarget.src = defaultProfileImage
                    }}
                  />
                </div>
              </button>
              {isProfileOpen && (
                <div
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50"
                >
                  <div className="space-y-2">
                    <a id="profileLink" href={profileState.profileLink} className="text-blue-500 flex items-center mb-3">
                      <span id="profileLinkText">{profileState.profileLinkText}</span>
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
                      <strong>Username:</strong> <span id="username">{profileState.username}</span>
                    </p>
                    <p>
                      <strong>Email:</strong> <span id="email">{profileState.email}</span>
                    </p>
                    <p>
                      <strong>Role:</strong> <span id="role">{profileState.role}</span>
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
                    <a href="#" onClick={logout} className="text-red-500 flex items-center mt-2">
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
              )}
            </div>
            {/* Cart */}
            <Link href="/cart">
              <button className="p-2 text-white hover:bg-blue-600 rounded-full relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {totalDistinctItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-light-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalDistinctItems}
                  </span>
                )}
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
                {totalDistinctItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-light-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalDistinctItems}
                  </span>
                )}
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
        {/* Search Bar for mobile */}
        {isSearchOpen && (
          <div className="py-4 border-t border-blue-600 md:hidden">
            <div className="container mx-auto px-4">
              <form className="relative" onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pr-10 bg-white border-light-gray"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  autoFocus
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2" type="submit">
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
              </form>
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
                        isActive(link) ? "bg-fros-blue/10 text-fros-blue font-semibold" : "text-gray-600 hover:bg-gray-50"
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
