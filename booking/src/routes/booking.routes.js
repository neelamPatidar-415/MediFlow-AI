const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../Middlewares/auth.middleware");
const validator = require("../Middlewares/validator.middleware");

// Patient Routes
router.post(
    "/",
    authMiddleware.createAuthMiddleware(["patient"]),
    bookingController.createBooking
);

router.get(
    "/my",
    authMiddleware.createAuthMiddleware(["patient"]),
    bookingController.getMyBookings
);

router.get(
    "/:id",
    authMiddleware.createAuthMiddleware(["patient"]),
    validator.bookingIdValidation,
    bookingController.getBookingById
);

router.patch(
    "/:id/cancel",
    authMiddleware.createAuthMiddleware(["patient"]),
    validator.bookingIdValidation,
    bookingController.cancelBooking
);

// Hospital/Admin Routes

router.get(
    "/hospital/all",
    authMiddleware.createAuthMiddleware(["hospital_admin", "admin"]),
    bookingController.getHospitalBookings
);

module.exports = router;