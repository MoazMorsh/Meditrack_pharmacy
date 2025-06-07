const PharmacistRepository = require("../Repositories/PharmacistRepository");

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
  


  module.exports = {
    viewProfile,
    editProfile,
    deleteAccount,
  };
  