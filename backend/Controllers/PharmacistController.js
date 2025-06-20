const express = require("express");
const router = express.Router();
const PharmacistServices = require("../Services/PharmacistServices");

// Profile Services

// View Profile
router.get("/view-profile/:id", async (req, res, next) => {
  try {
    const { id } = req.params; // Get id from URL params
    const profile = await PharmacistServices.viewProfile(id);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
});

// Edit Profile
router.put("/edit-profile/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = await PharmacistServices.editProfile(id, updates);
    res.status(200).json("Profile Updated Successfully", updated);
  } catch (err) {
    next(err);
  }
});

// Delete Account
router.delete("/remove-account/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const removed = await PharmacistServices.deleteAccount(id);
    res.status(200).json("account removed successfully", removed);
  } catch (err) {
    next(err);
  }
});
//----------------------------------------------------------------------------------------
// Branches Services

// Create Branches
router.post("/branch", async (req, res, next) => {
  try {
      const { branch_name, pharmacy_id, address, phone, email, website, location  } = req.body;
      const branch = await PharmacistServices.createBranch({ branch_name, pharmacy_id, address, phone, email, website, location });
      res.status(201).json("Branch Added Successfully",branch);
  } catch (err) {
      next(err);
  }
});

// Get all Branches
router.get("/branches", async (req, res, next) => {
  try {
    const allBranches = await PharmacistServices.getAllBranches();
    res.status(200).json(allBranches);
  } catch (err) {
    next(err);
  }
});
// Get Branch by id
router.get("/branch/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); // 👈 ensure it's a number
    const branch = await PharmacistServices.getBranchById(id);
    res.status(200).json(branch);
  } catch (err) {
    next(err);
  }
});

// Update Branch
router.put("/branch/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = req.body;
      const updated = await PharmacistServices.updateBranch(id, product);
      res.status(200).json("Branch Updated Successfully",updated);
    } catch (err) {
      next(err);
    }
  });

  // Delete Branch
router.delete("/branch/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
      const deletedBranch = await PharmacistServices.deleteBranch(id);
      res.status(200).json("Branch Deleted Successfully",deletedBranch);
  } catch (err) {
      next(err);
  }
});
//----------------------------------------------------------------------------------------

// Medicine Services

// Create Medicine
router.post("/medicines", async (req, res, next) => {
  try {
      const { name, generic_name, category, type, active_ingredients, prescription_required, storage_conditions, img_URL, quantity, price } = req.body;
      const medicine = await PharmacistServices.createMedicine({ name, generic_name, category, type, active_ingredients, prescription_required, storage_conditions, img_URL, quantity, price });
      res.status(201).json("Medicine Created Successfully",medicine);
  } catch (err) {
      next(err);
  }
});

// Get all medicines
router.get("/medicines", async (req, res, next) => {
  try {
    const allMedicines = await PharmacistServices.getAllMedicines();
    res.status(200).json(allMedicines);
  } catch (err) {
    next(err);
  }
});
// Get medicine by id
router.get("/medicine/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); // 👈 ensure it's a number
    const medicine = await PharmacistServices.getMedicineById(id);
    res.status(200).json(medicine);
  } catch (err) {
    next(err);
  }
});

// Update medicine
router.put("/medicines/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = req.body;
      const updated = await PharmacistServices.updateMedicine(id, product);
      res.status(200).json("Medicine Updated Successfully",updated);
    } catch (err) {
      next(err);
    }
  });

  // Delete Medicine
router.delete("/medicines/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
      const deletedMedicine = await PharmacistServices.deleteMedicine(id);
      res.status(200).json("Medicine Deleted Successfully",deletedMedicine);
  } catch (err) {
      next(err);
  }
});
//----------------------------------------------------------------------------------------
// Branches Services

// Create Branches
router.post("/branch", async (req, res, next) => {
  try {
      const { branch_name, pharmacy_id, address, phone, email, website, location  } = req.body;
      const branch = await PharmacistServices.createBranch({ branch_name, pharmacy_id, address, phone, email, website, location });
      res.status(201).json("Branch Added Successfully",branch);
  } catch (err) {
      next(err);
  }
});

// Get all Branches
router.get("/branches", async (req, res, next) => {
  try {
    const allBranches = await PharmacistServices.getAllBranches();
    res.status(200).json(allBranches);
  } catch (err) {
    next(err);
  }
});
// Get Branch by id
router.get("/branch/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); // 👈 ensure it's a number
    const branch = await PharmacistServices.getBranchById(id);
    res.status(200).json(branch);
  } catch (err) {
    next(err);
  }
});

// Update Branch
router.put("/branch/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = req.body;
      const updated = await PharmacistServices.updateBranch(id, product);
      res.status(200).json("Branch Updated Successfully",updated);
    } catch (err) {
      next(err);
    }
  });

  // Delete Branch
router.delete("/branch/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
      const deletedBranch = await PharmacistServices.deleteBranch(id);
      res.status(200).json("Branch Deleted Successfully",deletedBranch);
  } catch (err) {
      next(err);
  }
});

//----------------------------------------------------------------------------------------

// Medicine Services

// Create Pharmacy
router.post("/pharmacy", async (req, res, next) => {
  try {
      const { name, address, phone, email, website, google_maps} = req.body;
      const pharmacy = await PharmacistServices.createPharmacy({ name, address, phone, email, website, google_maps });
      res.status(201).json("Pharmacy Created Successfully",pharmacy);
  } catch (err) {
      next(err);
  }
});

// Get all pharmacies
router.get("/pharmacy", async (req, res, next) => {
  try {
    const allPharmacies = await PharmacistServices.getAllPharmacies();
    res.status(200).json(allPharmacies);
  } catch (err) {
    next(err);
  }
});
// Get pharmacy by id
router.get("/pharmacy/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); 
    const pharmacy = await PharmacistServices.getPharmacyById(id);
    res.status(200).json(pharmacy);
  } catch (err) {
    next(err);
  }
});

// Update Pharmacy
router.put("/pharmacy/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const pharma = req.body;
      const updated = await PharmacistServices.updatePharmacy(id, pharma);
      res.status(200).json("Pharmacy Updated Successfully",updated);
    } catch (err) {
      next(err);
    }
  });

  // Delete Pharmacy
router.delete("/pharmacy/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
      const deletedPharmacy = await PharmacistServices.deletePharmacy(id);
      res.status(200).json("Pharmacy Deleted Successfully",deletedPharmacy);
  } catch (err) {
      next(err);
  }
});


//-------------------------------------------------------------------------------------------------------------------------------

// Prescription Controller

router.get("/PendingPrescription", async (req, res, next) => {
  try {
    const prescriptions = await PharmacistServices.getPendingPerciptions();
    return res.status(200).json(prescriptions);
  } catch (err) {
    next (err);
  }
})

// Approve Prescription
router.put("/approve-prescription/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const approved = await PharmacistServices.approvePrescription(id);
    res.status(200).json("Prescription Approved Successfully", approved);
  } catch (err) {
    next (err);
  }
})

// Reject Prescription
router.put("/reject-prescription/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const rejected = await PharmacistServices.rejectPrescription(id);
    res.status(200).json("Prescription Rejected Successfully", rejected);
  } catch (err) {
    next (err);
  }
})


  
module.exports = router;
