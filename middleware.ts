import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/", "/about", "/contact", "/products"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If token exists, verify it
  if (token) {
    const session = await decrypt(token)

    // If token is invalid and trying to access protected route, redirect to login
    if (!session && !isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Role-based access control
    if (session) {
      const { role } = session

      // Admin routes
      if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Pharmacist routes
      if (request.nextUrl.pathname.startsWith("/pharmacist") && role !== "pharmacist") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
