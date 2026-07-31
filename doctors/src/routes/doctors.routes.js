const express = require("express");
const multer = require("multer");

const doctorController = require("../controllers/doctors.controller");
const authMiddleware = require("../Middlewares/auth.middleware");
const validatorMiddleware = require("../Middlewares/validator.middleware");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

// Create Doctor
router.post(
    "/",
    authMiddleware.createAuthMiddleware(["hospital_admin", "admin"]),
    upload.single("profileImage"),
    validatorMiddleware.doctorValidators,
    doctorController.createDoctor
);

// Get all doctors (supports search, specialization, city, hospital, etc.)
router.get("/", doctorController.getDoctors);

// Get all doctors of logged-in hospital
// Keep above "/:id" to avoid route conflict.
router.get(
    "/hospital",
    authMiddleware.createAuthMiddleware(["hospital_admin"]),
    doctorController.getHospitalDoctors
);

// Get doctor by id
router.get("/:id", doctorController.getDoctorById);

// Update doctor
router.patch(
    "/:id",
    authMiddleware.createAuthMiddleware(["hospital_admin", "admin"]),
    upload.single("profileImage"),
    doctorController.updateDoctor
);

// Delete doctor
router.delete(
    "/:id",
    authMiddleware.createAuthMiddleware(["hospital_admin", "admin"]),
    doctorController.deleteDoctor
);

module.exports = router;