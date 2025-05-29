import { NextResponse } from "next/server"
import { uploadPrescription } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { image, patientId } = await req.json()

    if (!image || !patientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload prescription to Supabase
    const prescription = await uploadPrescription({
      image,
      patient_id: patientId,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Prescription uploaded successfully!",
        prescription,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error uploading prescription:", error)
    return NextResponse.json({ error: error.message || "Failed to upload prescription" }, { status: 500 })
  }
}
