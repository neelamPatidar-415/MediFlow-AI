const axios = require("axios");
const bookingModel = require("../models/booking.model");
//for RabbitMQ of notification service
const { publishToQueue } = require("../broker/broker");

async function createBooking(req, res) {

    try {

        const { appointmentId, paymentId } = req.body;

        const token =
            req.cookies?.token ||
            req.header("Authorization")?.split(" ")[1];

        // Get appointment details
        const appointmentResponse = await axios.get(
            `http://localhost:3002/api/appointments/${appointmentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const appointment = appointmentResponse.data.appointment;

        // Get doctor details
        const doctorResponse = await axios.get(
            `http://localhost:3001/api/doctors/${appointment.doctor}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // console.log("DOCTOR RESPONSE:", doctorResponse.data);

        const doctor = doctorResponse.data.data;

        const booking = await bookingModel.create({

            patient: appointment.patient,

            doctor: appointment.doctor,

            payment: paymentId,

            doctorName: doctor.name,
            specialization: doctor.specialization,
            hospitalName: doctor.hospitalName,
            city: doctor.city,

            date: appointment.date,
            slot: appointment.slot,
            mode: appointment.mode,

            price: appointment.price,

            status: "CONFIRMED",

        });

        await publishToQueue(
            "BOOKING_CONFIRMED",
            booking
        );

        return res.status(201).json({
            message: "Booking created successfully",
            booking,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });

    }
}

async function getBookingById(req, res) {

    try {

        const { id } = req.params;

        const booking = await bookingModel.findOne({
            _id: id,
            patient: req.user.id,
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            booking,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });

    }

}

async function getMyBookings(req, res) {

    try {

        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");

        const query = {
            patient: req.user.id,
        };

        const total = await bookingModel.countDocuments(query);

        const bookings = await bookingModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            bookings,
            page,
            limit,
            total,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });

    }

}

async function cancelBooking(req, res) {

    try {

        const { id } = req.params;

        const booking = await bookingModel.findOne({
            _id: id,
            patient: req.user.id,
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        if (booking.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Booking cannot be cancelled",
            });
        }

        booking.status = "CANCELLED";

        await booking.save();

        await publishToQueue(
            "BOOKING_CANCELLED",
            booking
        );

        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });

    }

}

async function getHospitalBookings(req, res) {

    try {

        const hospitalName = req.user.hospitalName;

        const bookings = await bookingModel.find({
            hospitalName,
        });

        return res.status(200).json({
            bookings,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });

    }

}

async function completeBooking(req, res) {
    try {
        const { id } = req.params;

        const booking = await bookingModel.findOne({
            _id: id,
            hospitalName: req.user.hospitalName,
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        if (booking.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Only confirmed bookings can be completed",
            });
        }

        booking.status = "COMPLETED";
        await booking.save();

        await publishToQueue(
            "BOOKING_COMPLETED",
            booking
        );

        return res.status(200).json({
            message: "Booking marked as completed",
            booking,
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
    createBooking,
    getBookingById,
    getMyBookings,
    cancelBooking,
    getHospitalBookings,
    completeBooking,
};