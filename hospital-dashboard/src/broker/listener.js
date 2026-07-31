const { subscribeToQueue } = require("./broker");

const userModel = require("../models/user.model");
const doctorModel = require("../models/doctor.model");
const bookingModel = require("../models/booking.model");
const paymentModel = require("../models/payment.model");

module.exports = function () {

    //  USER 

    subscribeToQueue("USER_CREATED", async (user) => {
        try {
            await userModel.create(user);
        } catch (err) {
            console.error("USER_CREATED:", err.message);
        }
    });

    //  DOCTOR 

    subscribeToQueue("DOCTOR_CREATED", async (doctor) => {
        try {
            await doctorModel.create(doctor);
        } catch (err) {
            console.error("DOCTOR_CREATED:", err.message);
        }
    });

    subscribeToQueue("DOCTOR_UPDATED", async (doctor) => {
        try {
            await doctorModel.findByIdAndUpdate(
                doctor._id,
                doctor,
                { new: true }
            );
        } catch (err) {
            console.error("DOCTOR_UPDATED:", err.message);
        }
    });

    subscribeToQueue("DOCTOR_DELETED", async (doctor) => {
        try {
            await doctorModel.findByIdAndDelete(doctor.doctorId);
        } catch (err) {
            console.error("DOCTOR_DELETED:", err.message);
        }
    });

    //  BOOKING 

    subscribeToQueue("BOOKING_CONFIRMED", async (booking) => {
        try {
            await bookingModel.create(booking);
        } catch (err) {
            console.error("BOOKING_CONFIRMED:", err.message);
        }
    });

    subscribeToQueue("BOOKING_CANCELLED", async (booking) => {
        try {
            await bookingModel.findByIdAndUpdate(
                booking._id,
                { status: "CANCELLED" },
                { new: true }
            );
        } catch (err) {
            console.error("BOOKING_CANCELLED:", err.message);
        }
    });

    //  PAYMENT 

    subscribeToQueue("PAYMENT_COMPLETED", async (payment) => {
        try {
            await paymentModel.create(payment);
        } catch (err) {
            console.error("PAYMENT_COMPLETED:", err.message);
        }
    });

    subscribeToQueue("PAYMENT_UPDATED", async (payment) => {
        try {
            await paymentModel.findByIdAndUpdate(
                payment._id,
                payment,
                { new: true }
            );
        } catch (err) {
            console.error("PAYMENT_UPDATED:", err.message);
        }
    });

};