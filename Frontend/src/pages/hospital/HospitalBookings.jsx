import { useEffect, useState } from "react";
import { getHospitalBookings } from "../../services/api";

function HospitalBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadBookings() {
        try {
            setLoading(true);
            setError("");

            const result = await getHospitalBookings();

            setBookings(result.bookings || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
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
                <h2>Loading bookings...</h2>
            </div>
        );
    }

    return (
        <div className="hospital-page">

            <div className="hospital-page-header">
                <div>
                    <h1>Bookings</h1>
                    <p>
                        {bookings.length} booking
                        {bookings.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="page-message">
                    <h2>No bookings yet</h2>
                    <p>
                        Confirmed bookings for your hospital will appear here.
                    </p>
                </div>
            ) : (
                <div className="hospital-bookings-list">

                    {bookings.map((booking) => (
                        <div
                            className="hospital-booking-card"
                            key={booking._id}
                        >

                            <div className="hospital-booking-header">

                                <div>
                                    <h2>{booking.doctorName}</h2>

                                    <p>
                                        {booking.specialization}
                                    </p>
                                </div>

                                <span
                                    className={`booking-status ${booking.status?.toLowerCase()}`}
                                >
                                    {booking.status}
                                </span>

                            </div>

                            <div className="hospital-booking-details">

                                <div>
                                    <span>Patient ID</span>
                                    <strong>
                                        {booking.patient}
                                    </strong>
                                </div>

                                <div>
                                    <span>Date</span>
                                    <strong>
                                        {formatDate(booking.date)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Time</span>
                                    <strong>
                                        {booking.slot}
                                    </strong>
                                </div>

                                <div>
                                    <span>Mode</span>
                                    <strong>
                                        {booking.mode}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fee</span>
                                    <strong>
                                        ₹{booking.price?.amount}
                                    </strong>
                                </div>

                            </div>

                            <div className="hospital-booking-footer">
                                <span>
                                    Booking ID: {booking._id}
                                </span>

                                <span>
                                    {booking.city}
                                </span>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default HospitalBookings;