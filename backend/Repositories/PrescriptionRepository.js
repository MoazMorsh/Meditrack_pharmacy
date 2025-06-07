const supabase = require("../Config/supabaseClient");

async function getPrescriptions() {
  const { data, error } = await supabase.from("prescriptions").select("*");

  if (error) throw new Error(error.message);

  return data;
}

async function getPendingPrescriptions() {
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("status", "Pending");

  if (error) throw new Error(error.message);

  return data;
}

async function getPrescriptionById(id) {
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function createPrescription(prescription) {
  const { data, error } = await supabase
    .from("prescriptions")
    .insert([prescription])
    .single();

  if (error) {
    throw new Error(error.message);  // If there’s an error, throw it
  }

  return data;  // Return the successfully inserted data
}

async function updatePrescription(id, updates) {
  const { data, error } = await supabase
    .from("prescriptions")
    .update(updates)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

// Approve Prescription
async function approvePrescription(id) {
  const { data, error } = await supabase
    .from("prescriptions")
    .update({ status: "Approved" })
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
// Reject Prescription
async function rejectPrescription(id) {
  const { data, error } = await supabase
    .from("prescriptions")
    .update({ status: "Rejected" })
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function removePrescription(id) {
  const { error } = await supabase.from("prescriptions").delete().eq("id", id);
  if (error) throw error;
}

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  getPendingPrescriptions,
  createPrescription,
  updatePrescription,
  approvePrescription,
  rejectPrescription,
  removePrescription,
};
