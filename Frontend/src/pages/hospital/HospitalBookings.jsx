import { useEffect, useState } from "react";
import {
    getHospitalBookings,
    markBookingCompleted,
    getHospitalAdverseReactions,
} from "../../services/api";

function HospitalBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reports, setReports] = useState([]);

    async function loadBookings() {
        try {
            setLoading(true);
            setError("");

            const result = await getHospitalBookings();

            setBookings(result.bookings || []);

            const reportResult = await getHospitalAdverseReactions();

            setReports(reportResult.reports || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const followUpReports = reports.filter(
        (report) => report.followUpRequested
    );

    async function handleCompleteBooking(bookingId) {
      try {
        await markBookingCompleted(bookingId);
        await loadBookings();
      } catch (err) {
        setError(err.message);
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
                                <p>{booking.specialization}</p>
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
                                <strong>{booking.patient}</strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>
                                    {formatDate(booking.date)}
                                </strong>
                            </div>

                            <div>
                                <span>Time</span>
                                <strong>{booking.slot}</strong>
                            </div>

                            <div>
                                <span>Mode</span>
                                <strong>{booking.mode}</strong>
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

                            {booking.status === "CONFIRMED" && (
                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        handleCompleteBooking(
                                            booking._id
                                        )
                                    }
                                >
                                    Mark Completed
                                </button>
                            )}

                        </div>

                    </div>
                ))}

            </div>
        )}

        {/* =========================
            FOLLOW-UP REQUESTS
        ========================= */}

        <div className="hospital-reports-section">

            <div className="hospital-page-header">
                <div>
                    <h1>Doctor Follow-up Requests</h1>
                    <p>
                        {followUpReports.length} request
                        {followUpReports.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {followUpReports.length === 0 ? (
                <div className="page-message">
                    <p>No follow-up requests yet.</p>
                </div>
            ) : (
                <div className="hospital-reports-list">

                    {followUpReports.map((report) => (
                        <div
                            className="hospital-report-card follow-up-card"
                            key={report._id}
                        >

                            <div className="hospital-report-header">

                                <div>
                                    <h2>{report.medicineName}</h2>
                                    <p>
                                        Doctor: {report.doctorName}
                                    </p>
                                </div>

                                <span className="follow-up-badge">
                                    Follow-up Requested
                                </span>

                            </div>

                            <div className="hospital-report-details">

                                <div>
                                    <span>Patient ID</span>
                                    <strong>{report.patient}</strong>
                                </div>

                                <div>
                                    <span>Symptoms</span>
                                    <strong>{report.symptoms}</strong>
                                </div>

                                <div>
                                    <span>Reported On</span>
                                    <strong>
                                        {formatDate(report.createdAt)}
                                    </strong>
                                </div>

                            </div>

                            <div className="hospital-report-description">
                                <span>Description</span>
                                <p>{report.description}</p>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>

        {/* =========================
            ALL ADVERSE REACTION REPORTS
        ========================= */}

        <div className="hospital-reports-section">

            <div className="hospital-page-header">
                <div>
                    <h1>Adverse Reaction Reports</h1>
                    <p>
                        {reports.length} report
                        {reports.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="page-message">
                    <p>No adverse reaction reports yet.</p>
                </div>
            ) : (
                <div className="hospital-reports-list">

                    {reports.map((report) => (
                        <div
                            className="hospital-report-card"
                            key={report._id}
                        >

                            <div className="hospital-report-header">

                                <div>
                                    <h2>{report.medicineName}</h2>
                                    <p>
                                        Doctor: {report.doctorName}
                                    </p>
                                </div>

                                <span className="ml-badge">
                                    {report.mlPrediction}
                                </span>

                            </div>

                            <div className="hospital-report-details">

                                <div>
                                    <span>Patient ID</span>
                                    <strong>{report.patient}</strong>
                                </div>

                                <div>
                                    <span>Symptoms</span>
                                    <strong>{report.symptoms}</strong>
                                </div>

                                <div>
                                    <span>Duration</span>
                                    <strong>
                                        {report.duration || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>ML Confidence</span>
                                    <strong>
                                        {(report.mlConfidence * 100).toFixed(1)}%
                                    </strong>
                                </div>

                                <div>
                                    <span>Follow-up</span>
                                    <strong>
                                        {report.followUpRequested
                                            ? "Requested"
                                            : "Not requested"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Reported On</span>
                                    <strong>
                                        {formatDate(report.createdAt)}
                                    </strong>
                                </div>

                            </div>

                            <div className="hospital-report-description">
                                <span>Description</span>
                                <p>{report.description}</p>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>

    </div>
);
}

export default HospitalBookings;