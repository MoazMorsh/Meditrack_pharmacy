import { NextResponse } from "next/server"
import { signOut } from "@/lib/supabase"
import { logout } from "@/lib/auth"

export async function POST() {
  try {
    // Sign out from Supabase
    await signOut()

    // Clear the JWT token cookie
    await logout()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: error.message || "Logout failed" }, { status: 500 })
  }
}
