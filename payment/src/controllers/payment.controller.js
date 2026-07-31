const paymentModel = require('../models/payment.model');
const axios = require('axios');

const { publishToQueue } = require("../broker/broker");

require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function initiatePayment(req, res) {

    const token =
        req.cookies?.token ||
        req.header("Authorization")?.split(" ")[1];

    try {

        const appointmentId = req.params.appointmentId;
        const patientId = req.user.id;

        // Fetch appointment
        const appointmentResponse = await axios.get(
            `http://localhost:3002/api/appointments/${appointmentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const appointment = appointmentResponse.data.appointment;

        // Fetch doctor
        const doctorResponse = await axios.get(
            `http://localhost:3001/api/doctors/${appointment.doctor}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const doctor = doctorResponse.data.data;

        // Create Razorpay Order
        const razorpayOrder = await razorpay.orders.create({
            amount: appointment.price.amount * 100, // amount in paise
            currency: appointment.price.currency,
        });

        // Save Payment
        const payment = await paymentModel.create({

            appointment: appointment._id,
            patient: patientId,

            doctor: doctor._id,
            doctorName: doctor.name,
            hospitalName: doctor.hospitalName,

            razorpayOrderId: razorpayOrder.id,

            amount: appointment.price.amount,
            currency: appointment.price.currency,

        });

        return res.status(201).json({
            message: "Payment initiated successfully",
            payment,
            razorpayOrder,
        });

    } catch (err) {

        console.error("Payment initiation error:", err.message);
        console.error(err.response?.data);

        return res.status(500).json({
            error: err.response?.data || "Payment initiation failed",
        });

    }
}

async function verifyPayment(req, res) {

    const { razorpayOrderId, paymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const token =
        req.cookies?.token ||
        req.header("Authorization")?.split(" ")[1];

    try {

        const {
            validatePaymentVerification,
        } = require("razorpay/dist/utils/razorpay-utils");

        const isValid = validatePaymentVerification(
            {
                order_id: razorpayOrderId,
                payment_id: paymentId,
            },
            signature,
            secret
        );

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid payment signature",
            });
        }

        const payment = await paymentModel.findOne({
            razorpayOrderId,
            status: "PENDING",
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found",
            });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = "COMPLETED";

        await payment.save();

        // Fetch appointment details
        const appointmentResponse = await axios.get(
            `http://localhost:3002/api/appointments/${payment.appointment}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const appointment = appointmentResponse.data.appointment;

        // Create booking
        const bookingResponse = await axios.post(
            "http://localhost:3003/api/bookings",
            {
                patient: appointment.patient,
                doctor: appointment.doctor,

                doctorName: payment.doctorName,
                hospitalName: payment.hospitalName,

                date: appointment.date,
                slot: appointment.slot,
                mode: appointment.mode,

                price: {
                    amount: payment.amount,
                    currency: payment.currency,
                },

                payment: payment._id,
                status: "CONFIRMED",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const booking = bookingResponse.data.booking;

        // Delete appointment
        await axios.delete(
            `http://localhost:3002/api/appointments/${payment.appointment}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Publish events
        await publishToQueue("PAYMENT_COMPLETED", payment);

        await publishToQueue("BOOKING_CONFIRMED", booking);

        return res.status(200).json({
            message: "Payment verified successfully",
            payment,
            booking,
        });

    } catch (err) {

        console.error(err);

        await publishToQueue("PAYMENT_FAILED", {
            email: req.user.email,
            paymentId,
            razorpayOrderId,
        });

        return res.status(500).json({
            message: "Error verifying payment",
        });

    }
}


module.exports = {
    initiatePayment,
    verifyPayment,
}