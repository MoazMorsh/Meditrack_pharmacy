const supabase = require("../Config/supabaseClient");

async function getPatients() {
  const { data, error } = await supabase.from("patients").select("*");

  if (error) throw error;

  return data;
}

async function getPatientById(id) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}
async function getPatientByEmail(email) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data;
}

async function createPatient(patient) {
  const { data, error } = await supabase
    .from("patients")
    .insert([patient])
    .single();
  if (error) throw error;
  return data;
}

// update admin (update profile)

async function updatePatient(id, updates) {
  const { data, error } = await supabase
    .from("patients")
    .update([updates])
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function removePatient(id) {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw error;
}

module.exports = {
  getPatients,
  getPatientById,
  getPatientByEmail,
  createPatient,
  updatePatient,
  removePatient,
};
