const mongoose = require("mongoose");

const adverseReactionSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "booking",
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },

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

        medicineName: {
            type: String,
            required: true,
            trim: true,
        },

        symptoms: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: String,
            trim: true,
        },

        mlPrediction: {
            type: String,
            enum: ["ADR", "Non-ADR"],
            required: true,
        },

        mlConfidence: {
            type: Number,
            required: true,
        },

        followUpRequested: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "adverseReaction",
    adverseReactionSchema
);