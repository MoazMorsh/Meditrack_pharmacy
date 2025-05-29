import { NextResponse } from "next/server"
import { getOrders, createOrder, getPendingOrders } from "@/lib/supabase"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    // Check if user is admin or pharmacist
    if (session.role !== "admin" && session.role !== "pharmacist") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const url = new URL(req.url)
    const status = url.searchParams.get("status")

    if (status === "pending") {
      const pendingOrders = await getPendingOrders()
      return NextResponse.json(pendingOrders)
    } else {
      const orders = await getOrders()
      return NextResponse.json(orders)
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: Request, session: any) => {
  try {
    const { patient_id, items } = await req.json()

    // If patient is creating their own order
    if (session.role === "patient" && session.id !== patient_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const order = {
      patient_id,
      status: "pending_approval",
      created_at: new Date().toISOString(),
    }

    const result = await createOrder(order, items)
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
})
