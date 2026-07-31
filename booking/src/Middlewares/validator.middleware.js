const { param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

function respondWithValidationErrors(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }

    next();
}

const bookingIdValidation = [

    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid booking id");
            }
            return true;
        }),

    respondWithValidationErrors,
];

module.exports = {
    bookingIdValidation,
};