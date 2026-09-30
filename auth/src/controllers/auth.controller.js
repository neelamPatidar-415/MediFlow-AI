const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");
const mongoose = require('mongoose');

//for RabbitMQ of notification service
const { publishToQueue } = require("../broker/broker");

async function registerUser(req, res) {``
    try {
        const {
            fullName,
            email,
            password,
            phone,
            role,
            hospitalName
        } = req.body;

        // Check if user already exists
        const isUserAlreadyExist = await userModel.findOne({ email });

        if (isUserAlreadyExist) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            fullName,
            email,
            password: hash,
            phone,
            role,
            hospitalName
        });

        // Publish events
        await Promise.all([
            publishToQueue("USER_CREATED", {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hospitalName: user.hospitalName
            })

            // publishToQueue("AUTH_ADMIN.USER_CREATED", {
            //     id: user._id,
            //     fullName: user.fullName,
            //     email: user.email,
            //     role: user.role,
            //     hospitalName: user.hospitalName
            // })
        ]);

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                hospitalName: user.hospitalName
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hospitalName: user.hospitalName,
                address: user.address
            }
        });

    } catch (err) {
        console.error("Error in registering user:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                hospitalName: user.hospitalName
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hospitalName: user.hospitalName,
                address: user.address,
            },
        });
    } catch (err) {
        console.error("Error in login", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

async function getCurrentUser(req, res) {
    return res.status(200).json({
        message: "Current user fetched successfully",
        user: req.user,
    });
}

async function logoutUser(req, res) {
    const token = req.cookies.token;

    if (token) {
        try {
            if (redis && typeof redis.set === "function") {
                await redis.set(
                    `blacklist:${token}`,
                    "true",
                    "EX",
                    24 * 60 * 60
                );
            }
        } catch (err) {
            console.error("Redis error while blacklisting token", err);
        }
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
    });

    return res.status(200).json({
        message: "Logged out successfully",
    });
}

async function getUserAddress(req, res) {
    const user = await userModel.findById(req.user.id).select("address");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    return res.status(200).json({
        message: "Address retrieved successfully",
        address: user.address
    });
}

async function addOrUpdateUserAddress(req, res) {

    const { street, city, state, zip, country } = req.body;

    const user = await userModel.findByIdAndUpdate(
        req.user.id,
        {
            address: {
                street,
                city,
                state,
                zip,
                country
            }
        },
        {
            new: true
        }
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    return res.status(200).json({
        message: "Address updated successfully",
        address: user.address
    });
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getUserAddress,
    addOrUpdateUserAddress
}
