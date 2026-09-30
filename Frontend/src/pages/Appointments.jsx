import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAppointment } from "../services/api";

function Appointments() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");

    if (!state?.doctor) {
        return (
            <div className="page-message">
                <h2>No appointment selected</h2>

                <button
                    className="book-button"
                    onClick={() => navigate("/doctors")}
                >
                    Find a Doctor
                </button>
            </div>
        );
    }

    const { doctor, date, day, slot } = state;

    async function handleConfirm() {
        try {
            setBooking(true);
            setError("");

            await createAppointment({
                doctor: doctor._id,
                date,
                slot,
                mode: "OFFLINE",
                price: {
                    amount: doctor.price.amount,
                    currency: doctor.price.currency,
                },
            });

            alert("Appointment booked successfully!");

            navigate("/my-appointments");
        } catch (err) {
            setError(err.message);
        } finally {
            setBooking(false);
        }
    }

    return (
        <div className="booking-page">

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h1>Confirm Appointment</h1>

            <div className="booking-card">

                <div className="booking-doctor">
                    <h2>{doctor.name}</h2>

                    <p>
                        {doctor.specialization}
                    </p>

                    <p>
                        {doctor.hospitalName},{" "}
                        {doctor.city}
                    </p>
                </div>

                <hr />

                <div className="booking-details">

                    <div>
                        <span>Date</span>
                        <strong>{date}</strong>
                    </div>

                    <div>
                        <span>Day</span>
                        <strong>{day}</strong>
                    </div>

                    <div>
                        <span>Time</span>
                        <strong>{slot}</strong>
                    </div>

                    <div>
                        <span>Consultation</span>
                        <strong>Offline</strong>
                    </div>

                    <div>
                        <span>Fee</span>
                        <strong>
                            ₹{doctor.price?.amount}
                        </strong>
                    </div>

                </div>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <button
                    className="book-button"
                    onClick={handleConfirm}
                    disabled={booking}
                >
                    {booking
                        ? "Booking..."
                        : "Confirm Appointment"}
                </button>

            </div>
        </div>
    );
}

export default Appointments;