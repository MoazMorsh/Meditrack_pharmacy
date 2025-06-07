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


module.exports = router;
