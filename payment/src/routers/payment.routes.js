const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

// Create payment for an appointment
router.post(
    "/create/:appointmentId",
    authMiddleware.createAuthMiddleware(["patient"]),
    paymentController.initiatePayment
);

// Verify payment
router.post(
    "/verify",
    authMiddleware.createAuthMiddleware(["patient"]),
    paymentController.verifyPayment
);

module.exports = router;