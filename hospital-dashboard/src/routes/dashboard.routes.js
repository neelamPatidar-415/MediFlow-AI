const express = require("express");
const { createAuthMiddleware } = require("../middlewares/auth.middleware");
const controller = require("../controller/dashboard.controller");

const router = express.Router();

router.get(
    "/stats",
    createAuthMiddleware(["hospital_admin", "admin"]),
    controller.getDashboardStats
);

router.get(
    "/bookings",
    createAuthMiddleware(["hospital_admin", "admin"]),
    controller.getRecentBookings
);

router.get(
    "/doctors",
    createAuthMiddleware(["hospital_admin", "admin"]),
    controller.getHospitalDoctors
);

router.get(
    "/revenue",
    createAuthMiddleware(["hospital_admin", "admin"]),
    controller.getRevenue
);

module.exports = router;