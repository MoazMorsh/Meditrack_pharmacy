const supabase = require("../Config/supabaseClient");

async function createPharmacy(pharma) {
  const { data, error } = await supabase
    .from("pharmacy")
    .insert([pharma])
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function getPharmacies() {
  const { data, error } = await supabase.from("pharmacy").select("*");

  if (error) throw new Error(error.message);

  return data;
}

async function getPharmacyById(id) {
  const { data, error } = await supabase
    .from("pharmacy")
    .select("*")
    .eq("pharmacy_id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function updatePharmacy(id, updates) {
  const { data, error } = await supabase
    .from("pharmacy")
    .update(updates)
    .eq("pharmacy_id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function removePharmacy(id) {
  const { error } = await supabase.from("pharmacy").delete().eq("pharmacy_id", id);
  if (error) throw error;
}

module.exports = {
    createPharmacy,
    getPharmacies,
    getPharmacyById,
    updatePharmacy,
    removePharmacy
}
