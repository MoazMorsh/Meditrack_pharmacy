const supabase = require("../Config/supabaseClient");

async function createBranch(branch) {
  const { data, error } = await supabase
    .from("branch")
    .insert([branch])
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function getBranches() {
  const { data, error } = await supabase.from("branch").select("*");

  if (error) throw new Error(error.message);

  return data;
}

async function getBranchById(id) {
  const { data, error } = await supabase
    .from("branch")
    .select("*")
    .eq("branch_id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function updateBranch(id, updates) {
  const { data, error } = await supabase
    .from("branch")
    .update(updates)
    .eq("branch_id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function removeBranch(id) {
  const { error } = await supabase.from("branch").delete().eq("branch_id", id);
  if (error) throw error;
}

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    removeBranch
}
