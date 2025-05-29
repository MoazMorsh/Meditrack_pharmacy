// src/Controllers/MedicineController.js

const express = require("express");
const router = express.Router();
const AdminServices = require("../Services/AdminServices");

// Profile Services

// View Profile
router.get("/view-profile/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const profile = await AdminServices.viewProfile(id);
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
    const updated = await AdminServices.editProfile(id, updates);
    res.status(200).json("Profile Updated Successfully",updated);
  } catch (err) {
    next(err);
  }
});

// Delete Account 
router.delete("/remove-account/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
      const removed = await AdminServices.deleteAccount(id);
      res.status(200).json("account removed successfully", removed);
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
      const medicine = await AdminServices.createMedicine({ name, generic_name, category, type, active_ingredients, prescription_required, storage_conditions, img_URL, quantity, price });
      res.status(201).json("Medicine Updated Successfully",medicine);
  } catch (err) {
      next(err);
  }
});

// Get all medicines
router.get("/medicines", async (req, res, next) => {
  try {
    const allMedicines = await AdminServices.getAllMedicines();
    res.status(200).json(allMedicines);
  } catch (err) {
    next(err);
  }
});
// Get medicine by id
router.get("/medicine/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id); // 👈 ensure it's a number
    const medicine = await AdminServices.getMedicineById(id);
    res.status(200).json(medicine);
  } catch (err) {
    next(err);
  }
});

// Update medicine
router.put("/medicines/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const updated = await AdminServices.updateMedicine(id, updates);
      res.status(200).json("Medicine Updated Successfully",updated);
    } catch (err) {
      next(err);
    }
  });

  // Delete Medicine
router.delete("/medicines/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
      const deletedMedicine = await AdminServices.deleteMedicine(id);
      res.status(200).json("Medicine Deleted Successfully",deletedMedicine);
  } catch (err) {
      next(err);
  }
});

//-------------------------------------------------------------------------------------------------------------------------------

// Prescription Controller

router.get("/PendingPrescription", async (req, res, next) => {
  try {
    const prescriptions = await AdminServices.getPendingPerciptions();
    return res.status(200).json(prescriptions);
  } catch (err) {
    next (err);
  }
})

  
//-------------------------------------------------------------------------------------------------------------------------------------------------

// Orders Controller 
router.post("/create-order", async (req, res, next) => {
  try {
    const { patient_id, items } = req.body; // items: array of { medicineId, quantity, price_each }
    const order = await AdminServices.createOrder(patient_id, items);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// Get All Orders
router.get("/orders", async (req, res, next) => {
  try {
    const allOrders = await AdminServices.getAllOrders();
    res.status(200).json(allOrders);
  } catch (err) {
    next (err);
  }
});

// Get Pending Orders
router.get("/pending-orders", async (req, res, next) => {
  try {
    const pendingOrders = await AdminServices.getPendingOrders();
    res.status(200).json(pendingOrders);
  } catch (err) {
    next (err);
  }
});

// Get Order By Id
router.get("/order/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const order = await AdminServices.getOrderById(id);
    res.status(200).json(order);
  } catch (err) {
    next (err);
  }
});

// Get Patient Order 
router.get("/patient-order/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const order = await AdminServices.getPatientOrders(id);
    res.status(200).json(order);
  } catch (err) {
    next (err);
  }
});

// Approve Order
router.put("/approve-order/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const approved = await AdminServices.approveOrder(id);
    res.status(200).json("Order Approved Successfully", approved);
  } catch (err) {
    next (err);
  }
})

// Reject Order
router.put("/reject-order/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const rejected = await AdminServices.rejectOrder(id);
    res.status(200).json("Order Approved Successfully", rejected);
  } catch (err) {
    next (err);
  }
})

module.exports = router;
