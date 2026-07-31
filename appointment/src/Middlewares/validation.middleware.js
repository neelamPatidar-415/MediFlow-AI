const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

function validateAppointment(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
}

const appointmentValidator = [

    body("doctor")
        .notEmpty()
        .withMessage("Doctor id is required")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid doctor id");
            }
            return true;
        }),

    body("date")
        .isISO8601()
        .withMessage("Invalid appointment date"),

    body("slot")
        .trim()
        .notEmpty()
        .withMessage("Slot is required"),

    body("mode")
        .isIn(["ONLINE", "OFFLINE"])
        .withMessage("Mode must be ONLINE or OFFLINE"),

    body("price.amount")
        .isNumeric()
        .withMessage("Price amount must be a number"),

    body("price.currency")
        .optional()
        .isIn(["INR", "USD"])
        .withMessage("Currency must be INR or USD"),

    validateAppointment,
];

const appointmentUpdateValidator = [

    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid appointment id");
            }
            return true;
        }),

    body("date")
        .optional()
        .isISO8601()
        .withMessage("Invalid appointment date"),

    body("slot")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Slot cannot be empty"),

    body("mode")
        .optional()
        .isIn(["ONLINE", "OFFLINE"])
        .withMessage("Mode must be ONLINE or OFFLINE"),

    validateAppointment,
];

module.exports = {
    appointmentValidator,
    appointmentUpdateValidator,
};