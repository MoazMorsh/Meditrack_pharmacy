const PatientRepository = require("../Repositories/PatientRepository");
const PrescriptionRepository = require("../Repositories/PrescriptionRepository");
const OrderRepository = require("../Repositories/OrderRepository");
const MedicineRepository = require("../Repositories/MedicineRepository.js");

// Profile Services

// View profile
async function viewProfile(id) {
  const view = await PatientRepository.getPatientById(id);
  return view;
}

// edit profile
async function editProfile(id, updates) {
  const updateProfile = await PatientRepository.updatePatient(id,updates);
  return updateProfile;
}

// delete account
async function deleteAccount(id) {
  await PatientRepository.removePatient(id);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------

// PatientServices.js
async function uploadPrescription({ image, patientId }) {

  const pid = parseInt(patientId, 10);
  if (Number.isNaN(pid)) {
    throw new Error("Invalid patientId");
  }
  const patient = await PatientRepository.getPatientById(pid);
  if (!patient) {
    throw new Error("No patient found with id " + pid);
  }
  return await PrescriptionRepository.createPrescription({
    image,
    patientId: pid
  });
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

// Order Services

// Get Patient Orders
async function getPatientOrders(id) {
  const order = await OrderRepository.getPatientOrders(id);
  return order;
}

// Make Order
async function createOrder(patient_id, items) {
  let total = 0;
  let requiresApproval = false;
  const orderItems = [];

  for (let item of items) {
    const medicine = await MedicineRepository.getMedicineById(item.medicine_id);

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
  const status = requiresApproval ? "Pending" : "Pending";

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

module.exports = {
  viewProfile,
  editProfile,
  deleteAccount,
  uploadPrescription,
  getPatientOrders,
  createOrder,
};
