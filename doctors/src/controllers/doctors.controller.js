const Doctor = require('../models/doctors.model');
const { uploadImage } = require('../services/Imagekit.service');
const mongoose = require('mongoose');

const { publishToQueue } = require('../broker/broker');

async function createDoctor(req, res) {
    try {

        const {
            name,
            specialization,
            qualification,
            experience,
            price,
            hospitalName,
            city,
            mode,
            availableDays,
            availableSlots,
            languages,
            about,
        } = req.body;

        const hospitalId = req.user.id;

        let profileImage = {};

        if (req.file) {
            profileImage = await uploadImage(req.file.buffer);
        }

        const doctor = await Doctor.create({
            name,
            specialization,
            qualification,
            experience,
            price: {
                amount: price.amount,
                currency: price.currency || "INR",
            },
            hospitalId,
            hospitalName,
            city,
            mode,
            availableDays,
            availableSlots,
            languages,
            about,
            profileImage,
        });

        await publishToQueue("DOCTOR_CREATED", doctor);

        return res.status(201).json({
            message: "Doctor created successfully",
            data: doctor,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function getDoctors(req, res) {

    const {
        search,
        specialization,
        city,
        hospital,
        mode,
        available,
        minPrice,
        maxPrice,
        skip = 0,
        limit = 20,
    } = req.query;

    const filter = {};

    if (search) {
        filter.$text = { $search: search };
    }

    if (specialization) {
        filter.specialization = specialization;
    }

    if (city) {
        filter.city = city;
    }

    if (hospital) {
        filter.hospitalName = hospital;
    }

    if (mode) {
        filter.mode = mode;
    }

    if (available !== undefined) {
        filter.isAvailable = available === "true";
    }

    if (minPrice) {
        filter["price.amount"] = {
            ...filter["price.amount"],
            $gte: Number(minPrice),
        };
    }

    if (maxPrice) {
        filter["price.amount"] = {
            ...filter["price.amount"],
            $lte: Number(maxPrice),
        };
    }

    const doctors = await Doctor.find(filter)
        .skip(Number(skip))
        .limit(Math.min(Number(limit), 20));

    return res.status(200).json({
        data: doctors,
    });
}

async function getDoctorById(req, res) {
    try {

        const { id } = req.params;

        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                error: "Doctor not found",
            });
        }

        return res.status(200).json({
            data: doctor,
        });

    } catch (err) {

        if (err.name === "CastError") {
            return res.status(400).json({
                error: "Invalid doctor id",
            });
        }

        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
        });

    }
}

async function updateDoctor(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid doctor id",
            });
        }

        const doctor = await Doctor.findOne({
            _id: id,
            hospitalId: req.user.id,
        });

        if (!doctor) {
            return res.status(404).json({
                error: "Doctor not found",
            });
        }

        const allowedUpdates = [
            "name",
            "specialization",
            "qualification",
            "experience",
            "price",
            "hospitalName",
            "city",
            "mode",
            "availableDays",
            "availableSlots",
            "languages",
            "about",
            "rating",
            "totalReviews",
            "isAvailable",
        ];

        for (const key of Object.keys(req.body)) {
            if (!allowedUpdates.includes(key)) continue;

            if (key === "price" && typeof req.body.price === "object") {
                if (req.body.price.amount !== undefined) {
                    doctor.price.amount = req.body.price.amount;
                }

                if (req.body.price.currency !== undefined) {
                    doctor.price.currency = req.body.price.currency;
                }
            } else {
                doctor[key] = req.body[key];
            }
        }

        if (req.file) {
            doctor.profileImage = await uploadImage(req.file.buffer);
        }

        await doctor.save();

        await publishToQueue("DOCTOR_UPDATED", doctor);

        return res.status(200).json({
            message: "Doctor updated successfully",
            data: doctor,
        });

    } catch (err) {
        console.error("UPDATE DOCTOR ERROR:", err);

        return res.status(500).json({
            error: err.message || "Internal Server Error",
        });
    }
}

async function deleteDoctor(req, res) {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Invalid doctor id",
        });
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
        return res.status(404).json({
            error: "Doctor not found",
        });
    }

    if (doctor.hospitalId.toString() !== req.user.id) {
        return res.status(403).json({
            error: "Forbidden: You are not authorized to delete this doctor",
        });
    }

    await Doctor.deleteOne({ _id: id });

    await publishToQueue("DOCTOR_DELETED", {
        doctorId: doctor._id,
        hospitalId: doctor.hospitalId,
    });

    return res.status(200).json({
        message: "Doctor deleted successfully",
    });
}

async function getHospitalDoctors(req, res) {

    const hospitalId = req.user.id;

    const { skip = 0, limit = 20 } = req.query;

    const doctors = await Doctor.find({ hospitalId })
        .skip(Number(skip))
        .limit(Math.min(Number(limit), 20));

    return res.status(200).json({
        data: doctors,
    });
}

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    getHospitalDoctors,
};
