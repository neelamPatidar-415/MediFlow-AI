const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        const errs = error.array();
        return res.status(400).json({
            message: errs[0].msg || "Validation error",
            errors: errs,
        });
    }

    next();
};

const registerUserValidations = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("phone")
        .matches(/^\d{10}$/)
        .withMessage("Phone number must be exactly 10 digits"),

    body("role")
        .optional()
        .isIn(["patient", "hospital_admin", "admin"])
        .withMessage("Invalid role"),

    body("hospitalName")
        .if(body("role").equals("hospital_admin"))
        .notEmpty()
        .withMessage("Hospital name is required"),

    respondWithValidationErrors,
];

const loginUserValidations = [
    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    respondWithValidationErrors,
];

const addUserAddressValidations = [
    body("street")
        .trim()
        .notEmpty()
        .withMessage("Street is required"),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("zip")
        .matches(/^\d{5,8}$/)
        .withMessage("Zip must contain 5 to 8 digits"),

    body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required"),

    respondWithValidationErrors,
];

module.exports = {
    registerUserValidations,
    loginUserValidations,
    addUserAddressValidations,
};