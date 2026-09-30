const express = require("express");
const router = express.Router();

const adverseReactionController = require("../controllers/adverseReaction.controller");
const authMiddleware = require("../Middlewares/auth.middleware");

// Patient
router.post(
    "/",
    authMiddleware.createAuthMiddleware(["patient"]),
    adverseReactionController.createAdverseReaction
);

router.patch(
    "/:id/followup",
    authMiddleware.createAuthMiddleware(["patient"]),
    adverseReactionController.requestFollowUp
);

router.get(
    "/hospital",
    authMiddleware.createAuthMiddleware(["hospital_admin", "admin"]),
    adverseReactionController.getHospitalAdverseReactions
);

module.exports = router;