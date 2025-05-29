import { NextResponse } from "next/server"
import { signUp } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { email, password, username, role } = await req.json()

    // Validate input
    if (!email || !password || !username || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["patient", "pharmacist", "admin"]
    if (!validRoles.includes(role.toLowerCase())) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Register user
    const userData = await signUp(email, password, username, role.toLowerCase())

    return NextResponse.json(userData, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)

    // Handle specific errors
    if (error.message?.includes("already registered")) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Ensure we always return a proper JSON response
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
