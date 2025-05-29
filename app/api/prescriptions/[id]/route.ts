import { NextResponse } from "next/server"
import { getPrescriptionById, updatePrescription } from "@/lib/supabase"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    const { params } = req
    const id = Number.parseInt(params.id)
    const prescription = await getPrescriptionById(id)

    // Check if user is authorized to view this prescription
    if (session.role === "patient" && prescription.patient_id !== session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(prescription)
  } catch (error: any) {
    console.error(`Error fetching prescription ${req.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to fetch prescription" }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: Request, session: any) => {
  try {
    // Check if user is admin or pharmacist
    if (session.role !== "admin" && session.role !== "pharmacist") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { params } = req
    const id = Number.parseInt(params.id)
    const { status } = await req.json()

    const result = await updatePrescription(id, { status })
    return NextResponse.json(result)
  } catch (error: any) {
    console.error(`Error updating prescription ${req.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to update prescription" }, { status: 500 })
  }
})
