import { NextResponse } from "next/server"
import { getMedicineById, updateMedicine, deleteMedicine } from "@/lib/supabase"
import { withAuth } from "@/lib/auth"

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const medicine = await getMedicineById(id)
    return NextResponse.json(medicine)
  } catch (error: any) {
    console.error(`Error fetching medicine ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to fetch medicine" }, { status: 500 })
  }
}

export const PUT = withAuth(async (req: Request, session: any) => {
  try {
    // Check if user is admin
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { params } = req
    const id = Number.parseInt(params.id)
    const updates = await req.json()
    const updatedMedicine = await updateMedicine(id, updates)
    return NextResponse.json(updatedMedicine)
  } catch (error: any) {
    console.error(`Error updating medicine ${req.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to update medicine" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: Request, session: any) => {
  try {
    // Check if user is admin
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { params } = req
    const id = Number.parseInt(params.id)
    await deleteMedicine(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error deleting medicine ${req.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to delete medicine" }, { status: 500 })
  }
})
