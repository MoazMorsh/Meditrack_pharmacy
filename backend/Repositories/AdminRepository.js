const supabase = require("../Config/supabaseClient");

// Admin Services

// return all admins in db 
async function getAdmins() {
  const { data, error } = await supabase.from("admins").select("*");

  if (error) throw error;

  return data;
}
// return a specific admin by id
async function getAdminById(id) {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}
// return a specific admin by email
async function getAdminByEmail(email) {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data;
}

// create admin (for register function)
async function createAdmin(admin) {
  const { data, error } = await supabase
    .from("admins")
    .insert([admin])
    .single();
  if (error) throw error;
  return data;
}

// update admin (update profile)

async function updateAdmin(id, updates) {
  const {data, error} = await supabase
  .from("admins")
  .update([updates])
  .eq("id", id)
  .single();

  if(error) throw new Error(error.message);

  return data;
}

// remove admin (delete account)
async function removeAdmin(id) {
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) throw error;
}

module.exports = {
  getAdmins,
  getAdminById,
  getAdminByEmail,
  createAdmin,
  updateAdmin,
  removeAdmin,
};
