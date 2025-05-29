// src/services/AuthServices.js

const AdminsRepo = require("../Repositories/AdminRepository");
const PatientsRepo = require("../Repositories/PatientRepository");
const PharmacistsRepo = require("../Repositories/PharmacistRepository");
const supabase = require("../Config/supabaseClient");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../Config/Jwt.config");
const bcrypt = require("bcrypt");

// Helpers to ensure email is not already taken
async function ensureAdminEmailNotTaken(email) {
  const existing = await AdminsRepo.getAdminByEmail(email);
  if (existing) {
    const err = new Error(`An admin with email ${email} already exists`);
    err.status = 409;
    throw err;
  }
}

async function ensurePharmacistEmailNotTaken(email) {
  const existing = await PharmacistsRepo.getPharmacistByEmail(email);
  if (existing) {
    const err = new Error(`A pharmacist with email ${email} already exists`);
    err.status = 409;
    throw err;
  }
}

async function ensurePatientEmailNotTaken(email) {
  const existing = await PatientsRepo.getPatientByEmail(email);
  if (existing) {
    const err = new Error(`A patient with email ${email} already exists`);
    err.status = 409;
    throw err;
  }
}

async function registerAdmin({ email, password, username, role }) {
  // 1. Check for existing
  await ensureAdminEmailNotTaken(email);

  // 2. Hash password
  const password_hash = await bcrypt.hash(password, 12);

  // 3. Insert into admins
  const admin = { email, password_hash, username, role };

  await AdminsRepo.createAdmin(admin);

  const data = await AdminsRepo.getAdminByEmail(email);

  // 4. Return minimal admin
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    username: data.username,
  };
}

// Register Pharmacist
async function registerPharmacist({ email, password, username, role }) {
  // 1. Check for existing
  await ensurePharmacistEmailNotTaken(email);

  // 2. Hash password
  const password_hash = await bcrypt.hash(password, 12);

  // 3. Insert into pharmacists
  const pharmacist = { email, password_hash, username, role };

  await PharmacistsRepo.createpharmacists(pharmacist);

  const data = await PharmacistsRepo.getPharmacistByEmail(email);

  // 4. Return minimal pharmacist
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    username: data.username,
  };
}

// Register Patient
async function registerPatient({ email, password, username, role }) {
  // 1. Check for existing
  await ensurePatientEmailNotTaken(email);

  // 2. Hash password
  const password_hash = await bcrypt.hash(password, 12);

  // 3. Insert into patients
  const patient = { email, password_hash, username, role };

  await PatientsRepo.createPatient(patient);

  const data = await PatientsRepo.getPatientByEmail(email);

  // 4. Return minimal pharmacist
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    username: data.username,
  };
}

async function loginAdmin({ email, password }) {
  const admin = await AdminsRepo.getAdminByEmail(email);
  console.log("admin: ", admin)

  if (!admin) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 2. Compare hashes
  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 3. Generate JWT
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET.secret,
    { expiresIn: "1h" }
  );

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      username: admin.username,
    },
  };
}
async function loginPharmacist({ email, password }) {
  const pharmacist = await PharmacistsRepo.getPharmacistByEmail(email);

  if (!pharmacist) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 2. Compare hashes
  const match = await bcrypt.compare(password, pharmacist.password_hash);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 3. Generate JWT
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { id: pharmacist.id, email: pharmacist.email, role: pharmacist.role },
    JWT_SECRET.secret,
    { expiresIn: "1h" }
  );

  return {
    token,
    pharmacist: {
      id: pharmacist.id,
      email: pharmacist.email,
      role: pharmacist.role,
      username: pharmacist.username,
    },
  };
}
async function loginPatient({ email, password }) {
  const patient = await PatientsRepo.getPatientByEmail(email);

  if (!patient) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 2. Compare hashes
  const match = await bcrypt.compare(password, patient.password_hash);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 3. Generate JWT
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { id: patient.id, email: patient.email, role: patient.role },
    JWT_SECRET.secret,
    { expiresIn: "1h" }
  );

  return {
    token,
    patient: {
      id: patient.id,
      email: patient.email,
      role: patient.role,
      username: patient.username,
    },
  };
}

module.exports = {
  registerAdmin,
  registerPharmacist,
  registerPatient,
  loginAdmin,
  loginPharmacist,
  loginPatient,
};
