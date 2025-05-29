import { NextResponse } from "next/server"
import { getPatientOrders } from "@/lib/supabase"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    const { params } = req
    const patientId = Number.parseInt(params.id)

    // Check if user is authorized to view these orders
    if (session.role === "patient" && session.id !== patientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const orders = await getPatientOrders(patientId)
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error(`Error fetching patient orders for ${req.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to fetch patient orders" }, { status: 500 })
  }
})
