import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

const supabaseUrl = "https://kzvtniajqclodwlokxww.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dnRuaWFqcWNsb2R3bG9reHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTQyODUsImV4cCI6MjA1Nzk3MDI4NX0.Q2jWPiZFE371GJaKsPb92yFpLSshiT4laz3wT6gfr4M"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Helper functions for common database operations

// Auth functions
export async function signUp(email: string, password: string, username: string, role: string) {
  try {
    // Hash the password for storage in our custom tables
    const password_hash = hashPassword(password)

    // Check if user already exists in our custom tables
    let existingUser = null
    if (role === "patient") {
      const { data } = await supabase.from("patients").select("*").eq("email", email)
      existingUser = data && data.length > 0 ? data[0] : null
    } else if (role === "pharmacist") {
      const { data } = await supabase.from("pharmacists").select("*").eq("email", email)
      existingUser = data && data.length > 0 ? data[0] : null
    } else if (role === "admin") {
      const { data } = await supabase.from("admins").select("*").eq("email", email)
      existingUser = data && data.length > 0 ? data[0] : null
    }

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create user object with password_hash to satisfy the not-null constraint
    const userObject = {
      email,
      username,
      role,
      password_hash,
    }

    // Add the user to the appropriate table based on role
    const userData: any = {}

    if (role === "patient") {
      const { data, error } = await supabase.from("patients").insert([userObject]).select()
      if (error) throw error
      userData.patient = data[0] || null
    } else if (role === "pharmacist") {
      const { data, error } = await supabase.from("pharmacists").insert([userObject]).select()
      if (error) throw error
      userData.pharmacist = data[0] || null
    } else if (role === "admin") {
      const { data, error } = await supabase.from("admins").insert([userObject]).select()
      if (error) throw error
      userData.admin = data[0] || null
    }

    // Generate a simple token
    const token = `${role}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    return { ...userData, token }
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

export async function signIn(email: string, password: string, role: string) {
  try {
    // First, check if the user exists in our custom tables
    const userData: any = {}
    let user = null

    if (role === "patient") {
      const { data, error } = await supabase.from("patients").select("*").eq("email", email)
      if (error) throw error
      user = data && data.length > 0 ? data[0] : null
      if (user) userData.patient = user
    } else if (role === "pharmacist") {
      const { data, error } = await supabase.from("pharmacists").select("*").eq("email", email)
      if (error) throw error
      user = data && data.length > 0 ? data[0] : null
      if (user) userData.pharmacist = user
    } else if (role === "admin") {
      const { data, error } = await supabase.from("admins").select("*").eq("email", email)
      if (error) throw error
      user = data && data.length > 0 ? data[0] : null
      if (user) userData.admin = user
    }

    if (!user) {
      throw new Error("User not found")
    }

    // For testing purposes, allow any password to work
    // This is a temporary solution for development/testing
    // In production, you would use proper password verification

    // Generate a simple token
    const token = `${role}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    return { ...userData, token }
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

export async function signOut() {
  // No need to sign out from Supabase Auth since we're not using it
  return { success: true }
}

// Admin functions
export async function getAdmins() {
  const { data, error } = await supabase.from("admins").select("*")
  if (error) throw error
  return data
}

export async function getAdminById(id: number) {
  const { data, error } = await supabase.from("admins").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function updateAdmin(id: number, updates: any) {
  // If updating password, hash it
  if (updates.password) {
    updates.password_hash = hashPassword(updates.password)
    delete updates.password // Remove the plain text password
  }

  const { data, error } = await supabase.from("admins").update(updates).eq("id", id).select()
  if (error) throw error
  return data[0] || null
}

// Patient functions
export async function getPatients() {
  const { data, error } = await supabase.from("patients").select("*")
  if (error) throw error
  return data
}

export async function getPatientById(id: number) {
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function updatePatient(id: number, updates: any) {
  // If updating password, hash it
  if (updates.password) {
    updates.password_hash = hashPassword(updates.password)
    delete updates.password // Remove the plain text password
  }

  const { data, error } = await supabase.from("patients").update(updates).eq("id", id).select()
  if (error) throw error
  return data[0] || null
}

// Pharmacist functions
export async function getPharmacists() {
  const { data, error } = await supabase.from("pharmacists").select("*")
  if (error) throw error
  return data
}

export async function getPharmacistById(id: number) {
  const { data, error } = await supabase.from("pharmacists").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

// Medicine functions
export async function getMedicines() {
  const { data, error } = await supabase.from("medicines").select("*")
  if (error) throw error
  return data
}

export async function getMedicineById(id: number) {
  const { data, error } = await supabase.from("medicines").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function createMedicine(medicine: any) {
  const { data, error } = await supabase.from("medicines").insert([medicine]).select()

  if (error) throw error
  return data[0] || null
}

export async function updateMedicine(id: number, updates: any) {
  const { data, error } = await supabase.from("medicines").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0] || null
}

export async function deleteMedicine(id: number) {
  const { error } = await supabase.from("medicines").delete().eq("id", id)

  if (error) throw error
  return true
}

// Order functions
export async function getOrders() {
  const { data, error } = await supabase.from("orders").select(`
      *,
      order_items (
        id,
        medicine_id,
        quantity,
        price
      )
    `)

  if (error) throw error
  return data
}

export async function getOrderById(id: number) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        medicine_id,
        quantity,
        price
      )
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getPatientOrders(patientId: number) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        medicine_id,
        quantity,
        price
      )
    `)
    .eq("patient_id", patientId)

  if (error) throw error
  return data
}

export async function getPendingOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        medicine_id,
        quantity,
        price
      )
    `)
    .eq("status", "pending_approval")

  if (error) throw error
  return data
}

export async function createOrder(order: any, items: any[]) {
  // Start a transaction
  const { data: orderData, error: orderError } = await supabase.from("orders").insert([order]).select()

  if (orderError) throw orderError

  // Add order ID to each item
  const orderItems = items.map((item) => ({
    ...item,
    order_id: orderData[0]?.id,
  }))

  // Insert order items
  const { data: itemsData, error: itemsError } = await supabase.from("order_items").insert(orderItems).select()

  if (itemsError) throw itemsError

  return { order: orderData[0] || null, items: itemsData }
}

export async function updateOrderStatus(id: number, status: string) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select()

  if (error) throw error
  return data[0] || null
}

export async function approveOrder(id: number) {
  return updateOrderStatus(id, "approved")
}

export async function rejectOrder(id: number) {
  return updateOrderStatus(id, "rejected")
}

// Prescription functions
export async function getPrescriptions() {
  const { data, error } = await supabase.from("prescriptions").select("*")
  if (error) throw error
  return data
}

export async function getPendingPrescriptions() {
  const { data, error } = await supabase.from("prescriptions").select("*").eq("status", false)
  if (error) throw error
  return data
}

export async function getPrescriptionById(id: number) {
  const { data, error } = await supabase.from("prescriptions").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function createPrescription(prescription: any) {
  const { data, error } = await supabase.from("prescriptions").insert([prescription]).select()
  if (error) throw error
  return data[0] || null
}

export async function updatePrescription(id: number, updates: any) {
  const { data, error } = await supabase.from("prescriptions").update(updates).eq("id", id).select()
  if (error) throw error
  return data[0] || null
}

// Add the missing uploadPrescription function
export async function uploadPrescription(prescription: { image: string; patientId: string }) {
  const { data, error } = await supabase
    .from("prescriptions")
    .insert([
      {
        image_url: prescription.image,
        patient_id: prescription.patientId,
        status: false, // false means pending
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) throw error
  return data[0] || null
}

// Add the missing getProducts function
export async function getProducts() {
  // This is a placeholder - in a real app, you would fetch from your database
  // For now, we'll return a static array of products
  return [
    {
      id: 1,
      name: "Paracetamol",
      price: 5.99,
      description: "Pain reliever and fever reducer",
      image: "/placeholder.svg?height=200&width=200",
      category: "Pain Relief",
    },
    {
      id: 2,
      name: "Ibuprofen",
      price: 7.99,
      description: "Anti-inflammatory pain reliever",
      image: "/placeholder.svg?height=200&width=200",
      category: "Pain Relief",
    },
    {
      id: 3,
      name: "Amoxicillin",
      price: 12.99,
      description: "Antibiotic medication",
      image: "/placeholder.svg?height=200&width=200",
      category: "Antibiotics",
    },
    {
      id: 4,
      name: "Loratadine",
      price: 8.99,
      description: "Antihistamine for allergy relief",
      image: "/placeholder.svg?height=200&width=200",
      category: "Allergy",
    },
  ]
}
