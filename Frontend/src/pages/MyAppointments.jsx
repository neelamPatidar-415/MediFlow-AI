import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyAppointments,
    deleteAppointment,
    updateAppointment,
} from "../services/api";

import PaymentButton from "../components/PaymentButton";

function MyAppointments() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadAppointments() {
    // console.log("🔥 MY APPOINTMENTS PAGE: loadAppointments() CALLED");

    try {
        setLoading(true);
        setError("");

        // console.log("🔥 Calling getMyAppointments()");

        const result = await getMyAppointments();

        // console.log("🔥 GET MY APPOINTMENTS RESULT:", result);

        const appointments =
            Array.isArray(result)
                ? result
                : Array.isArray(result.appointments)
                    ? result.appointments
                    : Array.isArray(result.data)
                        ? result.data
                        : Array.isArray(result.data?.appointments)
                            ? result.data.appointments
                            : [];

        // console.log("🔥 FINAL APPOINTMENTS ARRAY:", appointments);

        setAppointments(appointments);

    } catch (err) {
        // console.error("🔥 MY APPOINTMENTS ERROR:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
    loadAppointments();

    const refresh = () => loadAppointments();
    window.addEventListener("appointmentCreated", refresh);

    return () => window.removeEventListener("appointmentCreated", refresh);
    }, []);

    async function handleCancel(id) {
        if (!window.confirm("Cancel this appointment?")) {
            return;
        }

        try {
            await deleteAppointment(id);
            await loadAppointments();
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleReschedule(appointment) {
        const newDate = window.prompt(
            "Enter new date (YYYY-MM-DD):",
            appointment.date?.slice(0, 10)
        );

        if (!newDate) return;

        const newSlot = window.prompt(
            "Enter new time slot:",
            appointment.slot
        );

        if (!newSlot) return;

        try {
            await updateAppointment(appointment._id, {
                date: newDate,
                slot: newSlot,
            });

            await loadAppointments();
        } catch (err) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="page-message">
                <h2>Loading appointments...</h2>
            </div>
        );
    }

    return (
        <div className="booking-page">

            <button
                className="back-button"
                onClick={() => navigate("/")}
            >
                ← Home
            </button>

            <div className="results-heading">
                <div>
                    <h1>My Appointments</h1>
                    <span>
                        {appointments.length} appointment
                        {appointments.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {error && (
                <p className="error">{error}</p>
            )}

            {appointments.length === 0 ? (
                <div className="page-message">
                    <h2>No appointments yet</h2>

                    <p>
                        Book an appointment with a doctor
                        to see it here.
                    </p>

                    <button
                        className="book-button"
                        onClick={() => navigate("/doctors")}
                    >
                        Find a Doctor
                    </button>
                </div>
            ) : (
                <div className="appointments-list">

                    {appointments.map((appointment) => (
                        <div
                            className="booking-card"
                            key={appointment._id}
                        >

                            <div className="booking-doctor">
                                <h2>
                                    <h2>{appointment.doctorName}</h2>
                                    {/* Doctor */}
                                </h2>

                                <p>
                                    Appointment ID:{" "}
                                    {appointment._id}
                                </p>
                            </div>

                            <div className="booking-details">

                                <div>
                                    <span>Date</span>
                                    <strong>
                                        {new Date(
                                            appointment.date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Time</span>
                                    <strong>
                                        {appointment.slot}
                                    </strong>
                                </div>

                                <div>
                                    <span>Mode</span>
                                    <strong>
                                        {appointment.mode}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fee</span>
                                    <strong>
                                        ₹
                                        {
                                            appointment.price
                                                ?.amount
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="appointment-actions">

                                <PaymentButton
                                    appointment={appointment}
                                />

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        handleReschedule(
                                            appointment
                                        )
                                    }
                                >
                                    Reschedule
                                </button>

                                <button
                                    className="cancel-button"
                                    onClick={() =>
                                        handleCancel(
                                            appointment._id
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default MyAppointments;