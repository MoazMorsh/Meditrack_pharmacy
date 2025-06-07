"use client"

import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash, MapPin, Phone, Mail, Globe, Calendar } from "lucide-react"

const API_BASE = "http://localhost:8081/pharmacist"

export interface Branch {
  branch_id: number
  pharmacy_id: number
  branch_name: string
  address: string
  phone: string
  email: string
  website: string
  location: string
  created?: string
  created_at?: string
  createdAt?: string
}

type BranchForm = Omit<Branch, "branch_id" | "created" | "created_at" | "createdAt">

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [form, setForm] = useState<BranchForm>({
    pharmacy_id: 1,
    branch_name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    location: "",
  })

  useEffect(() => {
    fetchBranches()
  }, [])

  async function fetchBranches() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/branches`)
      const data: Branch[] = await res.json()
      setBranches(data)
    } catch (err) {
      alert("Error fetching branches")
    } finally {
      setLoading(false)
    }
  }

  function openAddDialog() {
    setEditingBranch(null)
    setForm({
      pharmacy_id: 1,
      branch_name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      location: "",
    })
    setShowDialog(true)
  }

  function openEditDialog(branch: Branch) {
    setEditingBranch(branch)
    setForm({
      pharmacy_id: branch.pharmacy_id ?? 1,
      branch_name: branch.branch_name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
      website: branch.website || "",
      location: branch.location || "",
    })
    setShowDialog(true)
  }

  function closeDialog() {
    setShowDialog(false)
    setEditingBranch(null)
    setForm({
      pharmacy_id: 1,
      branch_name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      location: "",
    })
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "pharmacy_id" ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      let res: Response
      if (editingBranch) {
        res = await fetch(`${API_BASE}/branch/${editingBranch.branch_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        res = await fetch(`${API_BASE}/branch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      if (res.ok) {
        fetchBranches()
        closeDialog()
      } else {
        alert("Operation failed")
      }
    } catch (err) {
      alert("Operation failed")
    }
  }

  async function handleDelete(branch: Branch) {
    if (!window.confirm("Are you sure you want to delete this branch?")) return
    try {
      const res = await fetch(
        `${API_BASE}/branch/${branch.branch_id}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        fetchBranches()
      } else {
        alert("Delete failed")
      }
    } catch {
      alert("Delete failed")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Branches</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span>Branches</span>
        </div>
      </div>

      {/* Add Branch Button */}
      <div className="flex justify-end mb-6">
        <Button className="flex items-center gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </Button>
      </div>

      {/* Branches Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading branches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.branch_id} className="overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b">{branch.branch_name}</h3>
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5"><MapPin className="h-4 w-4" /></span>
                    <span>{branch.address}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5"><Phone className="h-4 w-4" /></span>
                    <span>{branch.phone}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5"><Mail className="h-4 w-4" /></span>
                    <span>{branch.email}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5"><Globe className="h-4 w-4" /></span>
                    <span>{branch.website}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5"><Calendar className="h-4 w-4" /></span>
                    <span>
                      Created:{" "}
                      {branch.created ||
                        branch.created_at?.split("T")[0] ||
                        branch.createdAt?.split("T")[0] ||
                        "N/A"}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5 font-bold">Pharmacy ID:</span>
                    <span>{branch.pharmacy_id}</span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => openEditDialog(branch)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDelete(branch)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBranch ? "Edit Branch" : "Add Branch"}
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs mb-1">Pharmacy ID</label>
              <Input
                name="pharmacy_id"
                type="number"
                placeholder="Pharmacy ID"
                value={form.pharmacy_id}
                onChange={handleFormChange}
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Branch Name</label>
              <Input
                name="branch_name"
                placeholder="Branch Name"
                value={form.branch_name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Address</label>
              <Input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Phone</label>
              <Input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Website</label>
              <Input
                name="website"
                placeholder="Website"
                value={form.website}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Location</label>
              <Input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBranch ? "Save Changes" : "Add Branch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
