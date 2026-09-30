import { useEffect, useState } from "react";
import { getHospitalAppointments } from "../../services/api";

function HospitalAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadAppointments() {
        try {
            setLoading(true);
            setError("");

            const result = await getHospitalAppointments();

            setAppointments(result.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAppointments();
    }, []);

    function formatDate(date) {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    if (loading) {
        return (
            <div className="page-message">
                <h2>Loading appointments...</h2>
            </div>
        );
    }

    return (
        <div className="hospital-page">

            <div className="hospital-page-header">
                <div>
                    <h1>Appointments</h1>
                    <p>
                        {appointments.length} appointment
                        {appointments.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            {appointments.length === 0 ? (
                <div className="page-message">
                    <h2>No appointments yet</h2>
                    <p>
                        Appointments for your hospital will appear here.
                    </p>
                </div>
            ) : (
                <div className="hospital-appointments-list">

                    {appointments.map((appointment) => (
                        <div
                            className="hospital-appointment-card"
                            key={appointment._id}
                        >

                            <div className="hospital-appointment-main">

                                <div className="hospital-appointment-doctor">
                                    <div className="hospital-small-avatar">
                                        {appointment.doctor?.profileImage?.url ? (
                                            <img
                                                src={appointment.doctor.profileImage.url}
                                                alt={appointment.doctor.name}
                                            />
                                        ) : (
                                            appointment.doctor?.name?.charAt(0) || "D"
                                        )}
                                    </div>

                                    <div>
                                        <h2>
                                            {appointment.doctor?.name || "Doctor"}
                                        </h2>

                                        <p>
                                            {appointment.doctor?.specialization || "Specialization unavailable"}
                                        </p>
                                    </div>
                                </div>

                                <div className="hospital-appointment-details">

                                    <div>
                                        <span>Patient ID</span>
                                        <strong>
                                            {appointment.patient}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Date</span>
                                        <strong>
                                            {formatDate(appointment.date)}
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
                                            ₹{appointment.price?.amount}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default HospitalAppointments;