const axios = require("axios");

const bookingModel = require("../models/booking.model");
const adverseReactionModel = require("../models/adverseReaction.model");

async function createAdverseReaction(req, res) {
    try {
        const {
            bookingId,
            medicineName,
            symptoms,
            description,
            duration,
            followUpRequested = false,
        } = req.body;

        // 1. Find booking belonging to logged-in patient
        const booking = await bookingModel.findOne({
            _id: bookingId,
            patient: req.user.id,
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        // 2. Only completed bookings can submit reports
        if (booking.status !== "COMPLETED") {
            return res.status(400).json({
                message:
                    "Adverse reaction can only be reported for completed bookings",
            });
        }

        // 3. Basic validation
        if (!medicineName || !symptoms || !description) {
            return res.status(400).json({
                message:
                    "Medicine name, symptoms and description are required",
            });
        }

        // 4. Prepare text for ML model
        const mlText = `
Medicine: ${medicineName}
Symptoms: ${symptoms}
Description: ${description}
Duration: ${duration || "Not specified"}
        `.trim();

        // 5. Call Python ML service
        const mlResponse = await axios.post(
            "http://localhost:8000/predict",
            {
                text: mlText,
            }
        );

        const {
            prediction,
            confidence,
        } = mlResponse.data;

        // 6. Save report in MongoDB
        const report = await adverseReactionModel.create({
            booking: booking._id,
            patient: booking.patient,
            doctor: booking.doctor,
            doctorName: booking.doctorName,
            hospitalName: booking.hospitalName,

            medicineName,
            symptoms,
            description,
            duration,

            mlPrediction: prediction,
            mlConfidence: confidence,

            followUpRequested,
        });

        return res.status(201).json({
            message: "Adverse reaction report submitted successfully",
            report,
        });

    } catch (err) {
        console.error("Create adverse reaction error:", err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

async function requestFollowUp(req, res) {
    try {
        const { id } = req.params;

        // id = booking ID
        // Find the adverse reaction report linked to this booking
        const report = await adverseReactionModel.findOne({
            booking: id,
            patient: req.user.id,
        });

        if (!report) {
            return res.status(404).json({
                message: "Adverse reaction report not found for this booking",
            });
        }

        // Mark follow-up as requested
        report.followUpRequested = true;
        await report.save();

        return res.status(200).json({
            message: "Doctor follow-up requested successfully",
            report,
        });

    } catch (err) {
        console.error("Request follow-up error:", err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

async function getHospitalAdverseReactions(req, res) {
    try {
        const hospitalName = req.user.hospitalName;

        const reports = await adverseReactionModel
            .find({ hospitalName })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            reports,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

module.exports = {
    createAdverseReaction,
    requestFollowUp,
    getHospitalAdverseReactions,
};