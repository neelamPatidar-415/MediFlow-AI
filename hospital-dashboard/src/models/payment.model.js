const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "appointment",
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },

        // Snapshot Information

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        doctorName: {
            type: String,
            required: true,
        },

        hospitalName: {
            type: String,
            required: true,
        },

        // Payment Details

        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING",
        },

        razorpayOrderId: {
            type: String,
            required: true,
        },

        paymentId: {
            type: String,
            default: null,
        },

        signature: {
            type: String,
            default: null,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            enum: ["INR", "USD"],
            default: "INR",
        },
    },
    {
        timestamps: true,
    }
);

const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = paymentModel;