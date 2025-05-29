import { NextResponse } from "next/server"
import { signIn } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json()

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["patient", "pharmacist", "admin"]
    if (!validRoles.includes(role.toLowerCase())) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Login user
    const userData = await signIn(email, password, role.toLowerCase())

    return NextResponse.json(userData, { status: 200 })
  } catch (error: any) {
    console.error("Login error:", error)

    // Handle specific errors
    if (error.message?.includes("User not found")) {
      return NextResponse.json({ error: "No user found with this email and role" }, { status: 401 })
    }

    if (error.message?.includes("Invalid password")) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}
