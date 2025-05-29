const supabase = require("../Config/supabaseClient");

// get all orders
async function getOrders() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) throw new Error(error.message);

  return data;
}

async function getAllOrdersWithItems() {
  const { data, error } = await supabase.from("orders").select(`
        *,
        order_items (
          id,
          medicine_id,
          quantity,
          price
        )
      `);

  if (error) {
    console.error("Error fetching orders with items:", error);
    throw new Error("Failed to fetch orders with items");
  }

  return data;
}

async function getOrdersById(id) {
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
    .single();

  if (error) throw new Error(error.message);

  return data;
}
async function getPatientOrders(patient_id) {
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
    .eq("patient_id", patient_id)
    ;

  if (error) throw new Error(error.message);

  return data;
}

// get pending_approval orders
async function getPendingOrders() {
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
    .single();

  if (error) throw new Error(error.message);

  return data;
}

// Create a new order
async function createOrder(order) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Create order items
async function createOrderItems(items) {
  const { data, error } = await supabase
    .from("order_items")
    .insert(items)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

// Update Order
async function updateOrder(id, updates) {
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
// Update Order
async function approveOrder(id) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "approved" })
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
// Update Order
async function rejectOrder(id) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "rejected" })
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function removeOrder(id) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

module.exports = {
  getAllOrdersWithItems,
  getOrders,
  getOrdersById,
  getPendingOrders,
  getPatientOrders,
  createOrder,
  createOrderItems,
  updateOrder,
  approveOrder,
  rejectOrder,
  removeOrder,
};
