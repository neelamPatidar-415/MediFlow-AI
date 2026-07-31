const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "doctor",
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
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model("appointment", appointmentSchema);

module.exports = Appointment;