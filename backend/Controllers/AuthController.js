const express = require("express");
const router = express.Router();
const AuthServices = require("../Services/AuthServices");

router.post("/register", async (req, res, next) => {
  const { role, email, password, username } = req.body;
  try {
    let user;
    switch (role) {
      case "admin":
        user = await AuthServices.registerAdmin({
          email,
          password,
          username,
          role,
        });
        break;
      case "pharmacist":
        user = await AuthServices.registerPharmacist({
          email,
          password,
          username,
          role,
        });
        break;
      case "patient":
        user = await AuthServices.registerPatient({
          email,
          password,
          username,
          role,
        });
        break;
      default:
        const err = new Error(`Invalid role: ${role}`);
        err.status = 400;
        throw err;
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password, role } = req.body;
  try {
    let user;
    switch (role) {
      case "admin":
        user = await AuthServices.loginAdmin({ email, password, role });
        break;
      case "pharmacist":
        user = await AuthServices.loginPharmacist({ email, password, role });
        break;
      case "patient":
        user = await AuthServices.loginPatient({ email, password, role });
        break;
      default:
        const err = new Error(`Invalid role: ${role}`);
        err.status = 400;
        throw err;
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
