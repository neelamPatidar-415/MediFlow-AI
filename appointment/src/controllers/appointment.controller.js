const appointmentModel = require('../models/appointment.model');
const axios = require("axios");

async function createAppointment(req, res) {

    try {

        const {
            doctor,
            date,
            slot,
            mode,
            price,
        } = req.body;

        const patient = req.user.id;

        const appointment = await appointmentModel.create({
            patient,
            doctor,
            date,
            slot,
            mode,
            price,
        });

        return res.status(201).json({
            message: "Appointment created successfully",
            appointment,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function updateAppointment(req, res) {

    try {

        const { id } = req.params;

        const appointment = await appointmentModel.findOne({
            _id: id,
            patient: req.user.id,
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }

        const allowedUpdates = [
            "date",
            "slot",
            "mode",
        ];

        for (const key of Object.keys(req.body)) {
            if (allowedUpdates.includes(key)) {
                appointment[key] = req.body[key];
            }
        }

        await appointment.save();

        return res.status(200).json({
            message: "Appointment updated successfully",
            appointment,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function getMyAppointments(req, res) {

    try {

        const appointments = await appointmentModel.find({
            patient: req.user.id,
        });

        return res.status(200).json({
            data: appointments,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function getAppointmentById(req, res) {

    try {

        const { id } = req.params;

        const appointment = await appointmentModel.findOne({
            _id: id,
            patient: req.user.id,
        });

        if (!appointment) {
            return res.status(404).json({
                error: "Appointment not found",
            });
        }

        return res.status(200).json({
            appointment,
        });

    } catch (err) {

        if (err.name === "CastError") {
            return res.status(400).json({
                error: "Invalid appointment id",
            });
        }

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function deleteAppointment(req, res) {

    try {

        const { id } = req.params;

        const appointment = await appointmentModel.findOne({
            _id: id,
            patient: req.user.id,
        });

        if (!appointment) {
            return res.status(404).json({
                error: "Appointment not found",
            });
        }

        await appointmentModel.deleteOne({
            _id: id,
        });

        return res.status(200).json({
            message: "Appointment deleted successfully",
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function clearAppointments(req, res) {

    try {

        await appointmentModel.deleteMany({
            patient: req.user.id,
        });

        return res.status(200).json({
            message: "All appointments cleared successfully",
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function getHospitalAppointments(req, res) {
    try {
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.split(" ")[1];

        // Get doctors belonging to this hospital
        const doctorResponse = await axios.get(
            "http://localhost:3001/api/doctors/hospital",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const doctors = doctorResponse.data.data || [];

        const doctorIds = doctors.map((doctor) => doctor._id);

        if (doctorIds.length === 0) {
            return res.status(200).json({
                data: [],
            });
        }

        const appointments = await appointmentModel.find({
            doctor: { $in: doctorIds },
        }).sort({ date: 1 });

        const doctorMap = {};

        doctors.forEach((doctor) => {
            doctorMap[doctor._id.toString()] = doctor;
        });

        const result = appointments.map((appointment) => ({
            ...appointment.toObject(),
            doctor: doctorMap[appointment.doctor.toString()] || {
                _id: appointment.doctor,
            },
        }));

        return res.status(200).json({
            data: result,
        });

    } catch (err) {
        console.error("GET HOSPITAL APPOINTMENTS ERROR:", err);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}

module.exports = {
    createAppointment,
    updateAppointment,
    getMyAppointments,
    getAppointmentById,
    deleteAppointment,
    clearAppointments,
    getHospitalAppointments
};
