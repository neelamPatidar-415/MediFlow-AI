const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "payment",
    },

    doctorName: {
        type: String,
        required: true,
    },

    specialization: {
        type: String,
        required: true,
    },

    hospitalName: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },

    slot: {
        type: String,
        required: true,
    },

    mode: {
        type: String,
        enum: ["ONLINE", "OFFLINE"],
        required: true,
    },

    price: {
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

    status: {
        type: String,
        enum: [
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
        ],
        default: "CONFIRMED",
    },

}, { timestamps: true });

const bookingModel = mongoose.model("booking", bookingSchema);

module.exports = bookingModel;