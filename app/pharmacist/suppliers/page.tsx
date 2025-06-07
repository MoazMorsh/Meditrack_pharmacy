"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash, ExternalLink, X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Pharmacy type
interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  google_maps?: string;
}

export default function Suppliers() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);

  // Form state
  const [form, setForm] = useState<Omit<Pharmacy, "id">>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    google_maps: "",
  });

  // Search
  const [search, setSearch] = useState("");

  // Fetch all pharmacies
  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8081/pharmacist/pharmacy");
      if (!res.ok) throw new Error("Failed to fetch pharmacies");
      const data = await res.json();
      // If returned as array, map id; if needed, update this line:
      setPharmacies(
        data.map((p: any) => ({
          id: p.id ?? p.pharmacy_id, // support both field names
          name: p.name,
          address: p.address,
          phone: p.phone,
          email: p.email,
          website: p.website,
          google_maps: p.google_maps,
        }))
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for add
  const openAddModal = () => {
    setEditingPharmacy(null);
    setForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      google_maps: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (pharmacy: Pharmacy) => {
    setEditingPharmacy(pharmacy);
    setForm({
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      email: pharmacy.email,
      website: pharmacy.website,
      google_maps: pharmacy.google_maps || "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPharmacy(null);
    setForm({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      google_maps: "",
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPharmacy) {
        // Update
        const res = await fetch(`http://localhost:8081/pharmacist/pharmacy/${editingPharmacy.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update pharmacy");
      } else {
        // Create
        const res = await fetch("http://localhost:8081/pharmacist/pharmacy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to add pharmacy");
      }
      fetchPharmacies();
      closeModal();
    } catch (err: any) {
      alert(err.message || "Operation failed");
    }
    setLoading(false);
  };

  // Delete pharmacy
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this pharmacy?")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/pharmacist/pharmacy/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete pharmacy");
      fetchPharmacies();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
    setLoading(false);
  };

  // Filter by search
  const filteredPharmacies = pharmacies.filter((p) =>
    [p.name, p.address, p.phone, p.email, p.website]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacies</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <span>Pharmacies</span>
        </div>
      </div>

      {/* Search & Add button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search pharmacies..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2 mt-3 md:mt-0" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          <span>Add Pharmacy</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPharmacies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400">
                      No pharmacies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell className="font-medium">{pharmacy.name}</TableCell>
                      <TableCell>{pharmacy.address}</TableCell>
                      <TableCell>{pharmacy.email}</TableCell>
                      <TableCell>{pharmacy.phone}</TableCell>
                      <TableCell>
                        {pharmacy.website && (
                          <a
                            href={
                              pharmacy.website.startsWith("http")
                                ? pharmacy.website
                                : `https://${pharmacy.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {pharmacy.website}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(pharmacy.google_maps, "_blank")}
                            disabled={!pharmacy.google_maps}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View on Map</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditModal(pharmacy)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(pharmacy.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal for Add/Edit Pharmacy */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingPharmacy ? "Edit Pharmacy" : "Add Pharmacy"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-1">Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Pharmacy Name"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Address</label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Address"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Phone</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Email</label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Website</label>
                <Input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="Website"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Google Maps Link</label>
                <Input
                  name="google_maps"
                  value={form.google_maps}
                  onChange={handleChange}
                  placeholder="Google Maps URL"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingPharmacy ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
