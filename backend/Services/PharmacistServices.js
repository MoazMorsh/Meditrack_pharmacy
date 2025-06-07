const PharmacistRepository = require("../Repositories/PharmacistRepository");
const MedicineRepo = require("../Repositories/MedicineRepository.js");
const OrderRepository = require("../Repositories/OrderRepository");
const BranchRepo = require("../Repositories/BranchRepository.js");


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
  };
  