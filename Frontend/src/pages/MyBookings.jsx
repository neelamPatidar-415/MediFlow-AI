import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyBookings,
    getBookingById,
} from "../services/api";

function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    async function loadBookings() {
        try {
            setLoading(true);
            setError("");

            const result = await getMyBookings();

            const bookingList =
                Array.isArray(result)
                    ? result
                    : Array.isArray(result.bookings)
                        ? result.bookings
                        : Array.isArray(result.data)
                            ? result.data
                            : Array.isArray(result.data?.bookings)
                                ? result.data.bookings
                                : [];

            setBookings(bookingList);

        } catch (err) {
            console.error("BOOKINGS ERROR:", err);

            setError(
                err.message || "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
    }, []);

    async function handleViewDetails(id) {
        try {
            setDetailsLoading(true);
            setError("");

            const result = await getBookingById(id);

            const booking =
                result?.booking ||
                result?.data ||
                result;

            setSelectedBooking(booking);

        } catch (err) {
            console.error(
                "BOOKING DETAILS ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to load booking details"
            );
        } finally {
            setDetailsLoading(false);
        }
    }

    function formatDate(date) {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    if (loading) {
        return (
            <div className="page-message">
                <h2>Loading bookings...</h2>
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
                    <h1>My Bookings</h1>

                    <span>
                        {bookings.length} booking
                        {bookings.length !== 1
                            ? "s"
                            : ""}
                    </span>
                </div>
            </div>

            {error && (
                <div className="booking-error">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (

                <div className="page-message">

                    <h2>No bookings yet</h2>

                    <p>
                        Your confirmed appointments will
                        appear here after successful payment.
                    </p>

                    <button
                        className="home-primary-button"
                        onClick={() =>
                            navigate("/doctors")
                        }
                    >
                        Find a Doctor
                    </button>

                </div>

            ) : (

                <div className="appointments-list">

                    {bookings.map((booking) => (

                        <div
                            className="booking-card"
                            key={booking._id}
                        >

                            {/* DOCTOR */}

                            <div className="booking-doctor">

                                <div>

                                    <h2>
                                        {booking.doctorName ||
                                            "Doctor Appointment"}
                                    </h2>

                                    {booking.specialization && (
                                        <p>
                                            {
                                                booking.specialization
                                            }
                                        </p>
                                    )}

                                    {(booking.hospitalName ||
                                        booking.city) && (
                                        <p>
                                            {
                                                booking.hospitalName
                                            }

                                            {booking.hospitalName &&
                                                booking.city
                                                ? ", "
                                                : ""}

                                            {booking.city}
                                        </p>
                                    )}

                                </div>

                                <span className="booking-status">
                                    {booking.status ||
                                        "CONFIRMED"}
                                </span>

                            </div>

                            {/* DETAILS */}

                            <div className="booking-details">

                                <div>
                                    <span>Date</span>

                                    <strong>
                                        {formatDate(
                                            booking.date
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Time</span>

                                    <strong>
                                        {booking.slot || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Mode</span>

                                    <strong>
                                        {booking.mode || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fee</span>

                                    <strong>
                                        ₹
                                        {booking.price?.amount ??
                                            "—"}
                                    </strong>
                                </div>

                            </div>

                            {/* BOOKING ID */}

                            <div className="booking-id">
                                Booking ID: {booking._id}
                            </div>

                            {/* ACTION */}

                            <div className="appointment-actions">

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        handleViewDetails(
                                            booking._id
                                        )
                                    }
                                    disabled={detailsLoading}
                                >
                                    {detailsLoading
                                        ? "Loading..."
                                        : "View Details"}
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* =========================
                BOOKING DETAILS MODAL
            ========================= */}

            {selectedBooking && (
                <div className="booking-modal-overlay">

                    <div className="booking-modal">

                        <button
                            className="booking-modal-close"
                            onClick={() =>
                                setSelectedBooking(null)
                            }
                        >
                            ×
                        </button>

                        <h2>
                            Booking Details
                        </h2>

                        <div className="booking-modal-details">

                            <div>
                                <span>Booking ID</span>
                                <strong>
                                    {selectedBooking._id}
                                </strong>
                            </div>

                            <div>
                                <span>Doctor</span>
                                <strong>
                                    {selectedBooking.doctorName ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Specialization</span>
                                <strong>
                                    {selectedBooking.specialization ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>
                                    {formatDate(
                                        selectedBooking.date
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Time</span>
                                <strong>
                                    {selectedBooking.slot ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Mode</span>
                                <strong>
                                    {selectedBooking.mode ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Fee</span>
                                <strong>
                                    ₹
                                    {selectedBooking.price
                                        ?.amount ?? "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {selectedBooking.status ||
                                        "CONFIRMED"}
                                </strong>
                            </div>

                        </div>

                        <button
                            className="home-primary-button"
                            onClick={() =>
                                setSelectedBooking(null)
                            }
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default MyBookings;