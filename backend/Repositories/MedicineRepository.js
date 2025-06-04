const supabase = require("../Config/supabaseClient");

async function getMedicines() {
  const { data, error } = await supabase
  .from("medicine")
  .select("*");

  if (error) throw new Error(error.message);

  return data;
}

async function getMedicineById(id) {
  const { data, error } = await supabase
    .from("medicine")
    .select("*")
    .eq("medicine_id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function createMedicine(medicine) {
  const { data, error } = await supabase
    .from("medicine")
    .insert([medicine])
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function updateMedicine(id, updates) {
  const { data, error } = await supabase
    .from("medicine")
    .update(updates)
    .eq("medicine_id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function removeMedicine(id) {
  const { error } = await supabase
    .from("medicine")
    .delete()
    .eq("medicine_id", id);
  if (error) throw error;
}

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  removeMedicine,
};
