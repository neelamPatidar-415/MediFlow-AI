const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        specialization: {
            type: String,
            required: true,
            trim: true,
        },

        qualification: {
            type: String,
            required: true,
        },

        experience: {
            type: Number,
            required: true,
            min: 0,
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

        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
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

        mode: {
            type: String,
            enum: ["ONLINE", "OFFLINE", "BOTH"],
            default: "BOTH",
        },

        availableDays: [
            {
                type: String,
            },
        ],

        availableSlots: [
            {
                type: String,
            },
        ],

        languages: [
            {
                type: String,
            },
        ],

        about: {
            type: String,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        profileImage: {
            url: String,
            thumbnail: String,
            id: String,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

doctorSchema.index({
    name: "text",
    specialization: "text",
    hospitalName: "text",
    city: "text",
    about: "text",
});

module.exports = mongoose.model("doctor", doctorSchema);