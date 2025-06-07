const AdminsRepo = require("../Repositories/AdminRepository");
const MedicineRepo = require("../Repositories/MedicineRepository.js");
const PrescriptionRepo = require("../Repositories/PrescriptionRepository");
const OrderRepository = require("../Repositories/OrderRepository");

// Profile Services

// View profile
async function viewProfile(id) {
  const view = await AdminsRepo.getAdminById(id);
  return view;
}

// edit profile
async function editProfile(id, updates) {
  const updateProfile = await AdminsRepo.updateAdmin(id, updates);
  return updateProfile;
}

// delete account
async function deleteAccount(id) {
  await AdminsRepo.deleteAdmin(id);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------

// Medicine Services

// create medicine
async function createMedicine(medicineData) {
  try {
    const medicine = await MedicineRepo.createMedicine(medicineData);
    return medicine;
  } catch (error) {
    throw new Error(`Error creating medicine: ${error.message}`);
  }
}

// get all medicine
async function getAllMedicines() {
  const medicines = await MedicineRepo.getMedicines();
  return medicines;
}

// get  medicine by Id
async function getMedicineById(id) {
  const medicines = await MedicineRepo.getMedicineById(id);
  return medicines;
}

// Update Medicine
async function updateMedicine(id, updates) {
  if (!id) {
    const err = new Error("Medicine ID is required.");
    err.status = 400;
    throw err;
  }
  const update = await MedicineRepo.updateMedicine(id, updates);
  return update;
}

// Delete Medicine
async function deleteMedicine(id) {
  try {
    const deletedMedicine = await MedicineRepo.removeMedicine(id);
    return deletedMedicine;
  } catch (error) {
    throw new Error(`Error deleting medicine: ${error.message}`);
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------

// Prescription Services

// list all Prescriptions
async function getAllPrescription() {
  const prescriptions = await PrescriptionRepo.getPrescriptions();
  return prescriptions;
}

// list pending Prescriptions
async function getPendingPerciptions() {
  const pending = await PrescriptionRepo.getPendingPrescriptions();
  return pending;
}

async function createOrder(patient_id, items) {
    let total = 0;
    let requiresApproval = false;
    const orderItems = [];
  
    for (let item of items) {
      const medicine = await MedicineRepo.getMedicineById(item.medicine_id);
  
      if (!medicine) {
        throw new Error(`Medicine with ID ${item.medicine_id} not found`);
      }
  
      total += medicine.price * item.quantity;
  
      // Check if the medicine needs a prescription
      if (medicine.prescription_required) { 
        requiresApproval = true;
      }
  
      orderItems.push({
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        price: medicine.price,
      });
    }
  
    // Decide the order status based on whether any medicine needs approval
    const status = requiresApproval ? "pending_approval" : "pending";
  
    // Create the order
    const order = await OrderRepository.createOrder({
      patient_id: patient_id,
      total_price: total,
      status: status,
    });
  
    const finalOrderItems = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));
  
    await OrderRepository.createOrderItems(finalOrderItems);
  
    return order;
  }
  


//---------------------------------------------------------------------------------------------------------------------------------------------------

// Order Services

// Get All Orders
async function getAllOrders() {
    const orders = await OrderRepository.getAllOrdersWithItems();
    return orders;
}

// Get Order By Id
async function getOrderById(id) {
    const order = await OrderRepository.getOrdersById(id);
    return order;
}
// Get Patient Orders
async function getPatientOrders(id) {
    const order = await OrderRepository.getPatientOrders(id);
    return order;
}
// Get Pending Orders
async function getPendingOrders() {
    const orders = await OrderRepository.getPendingOrders();
    return orders;
}

async function createOrder(patient_id, items) {
    let total = 0;
    let requiresApproval = false;
    const orderItems = [];
  
    for (let item of items) {
      const medicine = await MedicineRepo.getMedicineById(item.medicine_id);
  
      if (!medicine) {
        throw new Error(`Medicine with ID ${item.medicine_id} not found`);
      }
  
      total += medicine.price * item.quantity;
  
      // Check if the medicine needs a prescription
      if (medicine.requires_prescription) { 
        requiresApproval = true;
      }
  
      orderItems.push({
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        price: medicine.price,
      });
    }
  
    // Decide the order status based on whether any medicine needs approval
    const status = requiresApproval ? "pending_approval" : "pending";
  
    // Create the order
    const order = await OrderRepository.createOrder({
      patient_id: patient_id,
      total_price: total,
      status: status,
    });
  
    const finalOrderItems = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));
  
    await OrderRepository.createOrderItems(finalOrderItems);
  
    return order;
  }

async function approveOrder(id) {
    const approve = await OrderRepository.approveOrder(id);
    return approve;
}

async function rejectOrder(id) {
    const approve = await OrderRepository.rejectOrder(id);
    return approve;
}
  

module.exports = {
  viewProfile,
  editProfile,
  deleteAccount,
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getAllPrescription,
  getPendingPerciptions,
  getAllOrders,
  getOrderById,
  getPendingOrders,
  getPatientOrders,
  createOrder,
  approveOrder,
  rejectOrder
};
