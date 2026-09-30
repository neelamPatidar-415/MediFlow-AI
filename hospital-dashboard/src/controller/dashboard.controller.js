const bookingModel = require("../models/booking.model");
const paymentModel = require("../models/payment.model");
const doctorModel = require("../models/doctor.model");

async function getDashboardStats(req, res) {

    try {

        const hospitalName = req.user.hospitalName;

        // console.log("Hospital Name:", hospitalName);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalDoctors,
            totalBookings,
            completedBookings,
            cancelledBookings,
            todayBookings,
            payments,
        ] = await Promise.all([

            doctorModel.countDocuments({
                hospitalName,
            }),

            bookingModel.countDocuments({
                hospitalName,
            }),

            bookingModel.countDocuments({
                hospitalName,
                status: "COMPLETED",
            }),

            bookingModel.countDocuments({
                hospitalName,
                status: "CANCELLED",
            }),

            bookingModel.countDocuments({
                hospitalName,
                createdAt: { $gte: today },
            }),

            paymentModel.find({
                hospitalName,
                status: "COMPLETED",
            }),

        ]);

        const totalRevenue = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

        // console.log("Dashboard Stats:", {
        //     totalDoctors,
        //     totalBookings,
        //     todayBookings,
        //     completedBookings,
        //     cancelledBookings,
        //     totalRevenue,
        // });

        return res.status(200).json({

            totalDoctors,
            hospitalName,
            totalBookings,
            todayBookings,
            completedBookings,
            cancelledBookings,

            totalRevenue: {
                amount: totalRevenue,
                currency: payments.length
                    ? payments[0].currency
                    : "INR",
            },

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }

}

async function getRecentBookings(req, res) {

    try {

        const hospitalName = req.user.hospitalName;

        const bookings = await bookingModel
            .find({ hospitalName })
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            bookings,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }

}

async function getHospitalDoctors(req, res) {

    try {

        const hospitalName = req.user.hospitalName;

        const { skip = 0, limit = 20 } = req.query;

        const doctors = await doctorModel
            .find({ hospitalName })
            .skip(Number(skip))
            .limit(Math.min(Number(limit), 20));

        return res.status(200).json({
            doctors,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }

}

async function getRevenue(req, res) {

    try {

        const hospitalName = req.user.hospitalName;

        const payments = await paymentModel.find({
            hospitalName,
            status: "COMPLETED",
        });

        const revenue = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

        return res.status(200).json({

            amount: revenue,
            currency: payments.length
                ? payments[0].currency
                : "INR",

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }

}

module.exports = {
    getDashboardStats,
    getRecentBookings,
    getHospitalDoctors,
    getRevenue,
};