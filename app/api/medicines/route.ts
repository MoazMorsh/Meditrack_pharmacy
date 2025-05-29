import { NextResponse } from "next/server"
import { getMedicines, createMedicine } from "@/lib/supabase"
import { withAuth } from "@/lib/auth"

export const GET = async () => {
  try {
    const medicines = await getMedicines()
    return NextResponse.json(medicines)
  } catch (error: any) {
    console.error("Error fetching medicines:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch medicines" }, { status: 500 })
  }
}

export const POST = withAuth(async (req: Request, session: any) => {
  try {
    // Check if user is admin
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const medicineData = await req.json()
    const newMedicine = await createMedicine(medicineData)
    return NextResponse.json(newMedicine, { status: 201 })
  } catch (error: any) {
    console.error("Error creating medicine:", error)
    return NextResponse.json({ error: error.message || "Failed to create medicine" }, { status: 500 })
  }
})
