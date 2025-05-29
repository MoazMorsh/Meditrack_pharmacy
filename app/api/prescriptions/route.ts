import { NextResponse } from "next/server"
import { getPrescriptions, getPendingPrescriptions, createPrescription } from "@/lib/supabase"
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
      const pendingPrescriptions = await getPendingPrescriptions()
      return NextResponse.json(pendingPrescriptions)
    } else {
      const prescriptions = await getPrescriptions()
      return NextResponse.json(prescriptions)
    }
  } catch (error: any) {
    console.error("Error fetching prescriptions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch prescriptions" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: Request, session: any) => {
  try {
    const { image, patient_id } = await req.json()

    // If patient is uploading their own prescription
    if (session.role === "patient" && session.id !== patient_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const prescription = {
      image_url: image,
      patient_id,
      status: false, // false means pending
      created_at: new Date().toISOString(),
    }

    const result = await createPrescription(prescription)
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error("Error creating prescription:", error)
    return NextResponse.json({ error: error.message || "Failed to create prescription" }, { status: 500 })
  }
})
