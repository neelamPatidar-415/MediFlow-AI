const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
};

const doctorValidators = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Doctor name is required"),

    body("specialization")
        .trim()
        .notEmpty()
        .withMessage("Specialization is required"),

    body("qualification")
        .trim()
        .notEmpty()
        .withMessage("Qualification is required"),

    body("experience")
        .notEmpty()
        .withMessage("Experience is required")
        .bail()
        .isInt({ min: 0 })
        .withMessage("Experience must be a positive number"),

    body("price.amount")
        .notEmpty()
        .withMessage("Consultation fee is required")
        .bail()
        .isNumeric()
        .withMessage("Consultation fee must be a number"),

    body("price.currency")
        .optional()
        .isIn(["INR", "USD"])
        .withMessage("Currency must be either INR or USD"),

    body("hospitalName")
        .trim()
        .notEmpty()
        .withMessage("Hospital name is required"),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("mode")
        .optional()
        .isIn(["ONLINE", "OFFLINE", "BOTH"])
        .withMessage("Mode must be ONLINE, OFFLINE or BOTH"),

    handleValidation,
];

module.exports = {
    doctorValidators,
};