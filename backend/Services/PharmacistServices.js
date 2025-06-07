const PharmacistRepository = require("../Repositories/PharmacistRepository");
const MedicineRepo = require("../Repositories/MedicineRepository.js");
const OrderRepository = require("../Repositories/OrderRepository");
const BranchRepo = require("../Repositories/BranchRepository.js");
const PharmacyRepo = require("../Repositories/PharmacyRepository.js");
const PrescriptionRepo = require("../Repositories/PrescriptionRepository.js");


// Profile Services

// View profile
async function viewProfile(id) {
    const view = await PharmacistRepository.getPharmacistById(id);
    return view;
  }
  
  // edit profile
  async function editProfile(id, updates) {
    const updateProfile = await PharmacistRepository.updatePharmacist(id, updates);
    return updateProfile;
  }
  
  // delete account
  async function deleteAccount(id) {
    await PharmacistRepository.removePharmacist(id);
  }
  
//---------------------------------------------------------------------------------------------------------------------------------------------------
  
// Branch Services

// create branch
async function createBranch(branchData) {
  try {
    const branch = await BranchRepo.createBranch(branchData);
    return branch;
  } catch (error) {
    throw new Error(`Error creating branch: ${error.message}`);
  }
}

// get all branches
async function getAllBranches() {
  try {
    const branches = await BranchRepo.getBranches();
  return branches;
} catch (error) {
  throw new Error(`Error getting branches: ${error.message}`);
}
}

// get  branch by Id
async function getBranchById(id) {
  try { 
    const branch = await BranchRepo.getBranchById(id);
  return branch;
  } catch (error) {
    throw new Error(`Error getting branch: ${error.message}`);
  }
}

// update branch
async function updateBranch(id, updates) {
  if (!id) {
    const err = new Error("Branch ID is required.");
    err.status = 400;
    throw err;
  }
  const update = await BranchRepo.updateBranch(id, updates);
  return update;
}

// Delete Branch
async function deleteBranch(id) {
  try {
    const deletedBranch = await BranchRepo.removeBranch(id);
    return deletedBranch;
  } catch (error) {
    throw new Error(`Error deleting Branch: ${error.message}`);
  }
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
  
// pharmacy Services

// create pharmacy
async function createPharmacy(pharmacyData) {
  try {
    const pharmacy = await PharmacyRepo.createPharmacy(pharmacyData);
    return pharmacy;
  } catch (error) {
    throw new Error(`Error Creating Pharmacy: ${error.message}`);
  }
}

// get all branches
async function getAllPharmacies() {
  try {
    const pharmacies = await PharmacyRepo.getPharmacies();
  return pharmacies;
} catch (error) {
  throw new Error(`Error getting pharmacies: ${error.message}`);
}
}

// get pharmacy by Id
async function getPharmacyById(id) {
  try { 
    const pharma = await PharmacyRepo.getPharmacyById(id);
  return pharma;
  } catch (error) {
    throw new Error(`Error getting branch: ${error.message}`);
  }
}

// update pharmacy
async function updatePharmacy(id, updates) {
  if (!id) {
    const err = new Error("Pharmacy ID is required.");
    err.status = 400;
    throw err;
  }
  const update = await PharmacyRepo.updatePharmacy(id, updates);
  return update;
}

// Delete Pharmacy
async function deletePharmacy(id) {
  try {
    const deletedPharmacy = await PharmacyRepo.removePharmacy(id);
    return deletedPharmacy;
  } catch (error) {
    throw new Error(`Error deleting Branch: ${error.message}`);
  }
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

async function approvePrescription(id) {
  const approve = await PrescriptionRepo.approvePrescription(id);
  return approve;
}

async function rejectPrescription(id) {
  const approve = await PrescriptionRepo.rejectPrescription(id);
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
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
    createPharmacy,
    getAllPrescription,
    getPendingPerciptions,
    approvePrescription,
    rejectPrescription,
    getAllPharmacies,
    getPharmacyById,
    updatePharmacy,
    deletePharmacy,
    getAllOrders,
    getOrderById,
    getPendingOrders,
    getPatientOrders,
    createOrder,
    approveOrder,
    rejectOrder
  };
  