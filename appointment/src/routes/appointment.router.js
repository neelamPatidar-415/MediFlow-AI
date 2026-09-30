const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middlewares/auth.middleware");
const validator = require("../Middlewares/validation.middleware");
const appointmentController = require("../controllers/appointment.controller");

// Create Appointment
router.post(
    "/",
    authMiddleware.createAuthMiddleware(["patient"]),
    validator.appointmentValidator,
    appointmentController.createAppointment
);

// Get all appointments of logged-in patient
router.get(
    "/my",
    authMiddleware.createAuthMiddleware(["patient"]),
    appointmentController.getMyAppointments
);

// Get appointment by id (used internally by Payment Service)
router.get(
    "/:id",
    authMiddleware.createAuthMiddleware(["patient"]),
    appointmentController.getAppointmentById
);

// Update appointment (date/slot)
router.patch(
    "/:id",
    authMiddleware.createAuthMiddleware(["patient"]),
    validator.appointmentUpdateValidator,
    appointmentController.updateAppointment
);

// Delete appointment
router.delete(
    "/:id",
    authMiddleware.createAuthMiddleware(["patient"]),
    appointmentController.deleteAppointment
);

// Clear all appointments (optional)
router.delete(
    "/",
    authMiddleware.createAuthMiddleware(["patient"]),
    appointmentController.clearAppointments
);

router.get(
    "/hospital/all",
    authMiddleware.createAuthMiddleware(["hospital_admin", "admin"]),
    appointmentController.getHospitalAppointments
);

module.exports = router;