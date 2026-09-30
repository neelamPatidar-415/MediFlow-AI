import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyBookings,
  getBookingById,
  submitAdverseReaction,
  requestBookingFollowUp,
} from "../services/api";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [reportModalBooking, setReportModalBooking] = useState(null);
  const [reportForm, setReportForm] = useState({
    medicineName: "",
    symptoms: "",
    description: "",
    duration: "",
  });
  const [reportLoading, setReportLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const result = await getMyBookings();

      const bookingList = Array.isArray(result)
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

      setError(err.message || "Failed to load bookings");
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

      const booking = result?.booking || result?.data || result;

      setSelectedBooking(booking);
    } catch (err) {
      console.error("BOOKING DETAILS ERROR:", err);

      setError(err.message || "Failed to load booking details");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleSubmitReport(e) {
    e.preventDefault();

    try {
      setReportLoading(true);
      setError("");
      setSuccessMessage("");

      await submitAdverseReaction({
        bookingId: reportModalBooking._id,
        ...reportForm,
      });

      setReportModalBooking(null);

      setReportForm({
        medicineName: "",
        symptoms: "",
        description: "",
        duration: "",
      });

      setSuccessMessage("Adverse reaction report submitted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setReportLoading(false);
    }
  }

  async function handleFollowUp(bookingId) {
    try {
      setFollowUpLoading(bookingId);
      setError("");
      setSuccessMessage("");

      await requestBookingFollowUp(bookingId);

      setSuccessMessage("Doctor follow-up request submitted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setFollowUpLoading(null);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

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
    <div className="booking-page">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Home
      </button>

      <div className="results-heading">
        <div>
          <h1>My Bookings</h1>

          <span>
            {bookings.length} booking
            {bookings.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {error && <div className="booking-error">{error}</div>}

      {successMessage && (
        <div className="booking-success">{successMessage}</div>
      )}

      {bookings.length === 0 ? (
        <div className="page-message">
          <h2>No bookings yet</h2>

          <p>
            Your confirmed appointments will appear here after successful
            payment.
          </p>

          <button
            className="home-primary-button"
            onClick={() => navigate("/doctors")}
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="appointments-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              {/* DOCTOR */}

              <div className="booking-doctor">
                <div>
                  <h2>{booking.doctorName || "Doctor Appointment"}</h2>

                  {booking.specialization && <p>{booking.specialization}</p>}

                  {(booking.hospitalName || booking.city) && (
                    <p>
                      {booking.hospitalName}

                      {booking.hospitalName && booking.city ? ", " : ""}

                      {booking.city}
                    </p>
                  )}
                </div>

                <span className="booking-status">
                  {booking.status || "CONFIRMED"}
                </span>
              </div>

              {/* DETAILS */}

              <div className="booking-details">
                <div>
                  <span>Date</span>

                  <strong>{formatDate(booking.date)}</strong>
                </div>

                <div>
                  <span>Time</span>

                  <strong>{booking.slot || "—"}</strong>
                </div>

                <div>
                  <span>Mode</span>

                  <strong>{booking.mode || "—"}</strong>
                </div>

                <div>
                  <span>Fee</span>

                  <strong>₹{booking.price?.amount ?? "—"}</strong>
                </div>
              </div>

              {/* BOOKING ID */}

              <div className="booking-id">Booking ID: {booking._id}</div>

              {/* ACTION */}

              <div className="appointment-actions">
                <button
                  className="secondary-button"
                  onClick={() => handleViewDetails(booking._id)}
                  disabled={detailsLoading}
                >
                  {detailsLoading ? "Loading..." : "View Details"}
                </button>

                {booking.status === "COMPLETED" && (
                  <>
                    <button
                      className="report-reaction-button"
                      onClick={() => setReportModalBooking(booking)}
                    >
                      Report Adverse Reaction
                    </button>

                    <button
                      className="follow-up-button"
                      onClick={() => handleFollowUp(booking._id)}
                      disabled={followUpLoading === booking._id}
                    >
                      {followUpLoading === booking._id
                        ? "Requesting..."
                        : "Request Doctor Follow-up"}
                    </button>
                  </>
                )}
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
              onClick={() => setSelectedBooking(null)}
            >
              ×
            </button>

            <h2>Booking Details</h2>

            <div className="booking-modal-details">
              <div>
                <span>Booking ID</span>
                <strong>{selectedBooking._id}</strong>
              </div>

              <div>
                <span>Doctor</span>
                <strong>{selectedBooking.doctorName || "—"}</strong>
              </div>

              <div>
                <span>Specialization</span>
                <strong>{selectedBooking.specialization || "—"}</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{formatDate(selectedBooking.date)}</strong>
              </div>

              <div>
                <span>Time</span>
                <strong>{selectedBooking.slot || "—"}</strong>
              </div>

              <div>
                <span>Mode</span>
                <strong>{selectedBooking.mode || "—"}</strong>
              </div>

              <div>
                <span>Fee</span>
                <strong>₹{selectedBooking.price?.amount ?? "—"}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedBooking.status || "CONFIRMED"}</strong>
              </div>
            </div>

            <button
              className="home-primary-button"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================
    ADVERSE REACTION MODAL
========================= */}

      {reportModalBooking && (
        <div className="booking-modal-overlay">
          <div className="booking-modal adverse-report-modal">
            <button
              className="booking-modal-close"
              onClick={() => setReportModalBooking(null)}
            >
              ×
            </button>

            <h2>Report Adverse Reaction</h2>

            <p className="modal-subtitle">
              Tell us about any reaction you experienced after taking a
              medicine.
            </p>

            <form onSubmit={handleSubmitReport}>
              <div className="report-form-field">
                <label>Medicine Name</label>

                <input
                  type="text"
                  value={reportForm.medicineName}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      medicineName: e.target.value,
                    })
                  }
                  placeholder="e.g. Amoxicillin"
                  required
                />
              </div>

              <div className="report-form-field">
                <label>Symptoms</label>

                <input
                  type="text"
                  value={reportForm.symptoms}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      symptoms: e.target.value,
                    })
                  }
                  placeholder="e.g. Rash, itching, dizziness"
                  required
                />
              </div>

              <div className="report-form-field">
                <label>Description</label>

                <textarea
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what happened..."
                  rows="4"
                  required
                />
              </div>

              <div className="report-form-field">
                <label>Duration</label>

                <input
                  type="text"
                  value={reportForm.duration}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      duration: e.target.value,
                    })
                  }
                  placeholder="e.g. 2 days"
                />
              </div>

              <div className="report-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setReportModalBooking(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="report-submit-button"
                  disabled={reportLoading}
                >
                  {reportLoading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
