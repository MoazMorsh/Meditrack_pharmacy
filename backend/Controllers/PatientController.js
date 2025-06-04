const express = require("express");
const router = express.Router();
const PatientServices = require("../Services/PatientServices");

// Profile Services

// View Profile
router.get("/view-profile/:id", async (req, res, next) => {
  try {
    const { id } = req.params; // Get id from URL params
    const profile = await PatientServices.viewProfile(id);
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
    const updated = await PatientServices.editProfile(id, updates);
    res.status(200).json("Profile Updated Successfully", updated);
  } catch (err) {
    next(err);
  }
});

// Delete Account
router.delete("/remove-account/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const removed = await PatientServices.deleteAccount(id);
    res.status(200).json("account removed successfully", removed);
  } catch (err) {
    next(err);
  }
});
//----------------------------------------------------------------------------------------

router.post("/upload-prescription/:id", async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.id);
    const { image } = req.body;
    const prescription = { image, patientId };
    const uploaded = await PatientServices.uploadPrescription(prescription);

    res.status(201).json({
      message: "Prescription Uploaded Successfully",
      data: uploaded,
    });
  } catch (err) {
    next(err);
  }
});

//----------------------------------------------------------------------------------------------------------------------------

// Order Services

// Get Patient Order
router.get("/patient-order/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const order = await PatientServices.getPatientOrders(id);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

// Make Order
router.post("/create-order", async (req, res, next) => {
  try {
    const { patient_id, items } = req.body; // items: array of { medicineId, quantity, price_each }
    const order = await PatientServices.createOrder(patient_id, items);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
