import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../services/api";

function DoctorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedDay, setSelectedDay] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    useEffect(() => {
        async function fetchDoctor() {
            try {
                const result = await getDoctorById(id);
                setDoctor(result.data);
            } catch (err) {
                setError("Unable to load doctor details.");
            } finally {
                setLoading(false);
            }
        }

        fetchDoctor();
    }, [id]);

    if (loading) return <div className="page-message">Loading doctor...</div>;

    if (error) return <div className="page-message error">{error}</div>;

    if (!doctor) return <div className="page-message">Doctor not found.</div>;

    
    function getNextDate(dayName) {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        
        const today = new Date();
        const targetDay = days.indexOf(dayName);
        const currentDay = today.getDay();
        
        let difference = targetDay - currentDay;
        
        if (difference < 0) {
            difference += 7;
        }
        
        const date = new Date(today);
        date.setDate(today.getDate() + difference);
        
        return date.toISOString().split("T")[0];
    }
    
    function handleBooking() {
      if (!selectedDay || !selectedSlot) {
        alert("Please select a day and time slot.");
        return;
      }

      const date = getNextDate(selectedDay);

      navigate("/appointments", {
        state: {
          doctor,
          date,
          day: selectedDay,
          slot: selectedSlot,
        },
      });
    }

    return (
        <div className="doctor-details-page">

            <button
                className="back-button"
                onClick={() => navigate("/doctors")}
            >
                ← Back to Doctors
            </button>

            <div className="doctor-profile">

                <div className="doctor-profile-top">

                    <img
                        src={
                            doctor.profileImage?.url ||
                            "https://via.placeholder.com/150?text=Doctor"
                        }
                        alt={doctor.name}
                        className="doctor-profile-image"
                    />

                    <div>
                        <h1>{doctor.name}</h1>

                        <h3>{doctor.specialization}</h3>

                        <p>{doctor.qualification}</p>

                        <p>
                            {doctor.experience} years experience
                        </p>

                        <p>
                            ⭐ {doctor.rating || 0}
                            {" "}
                            ({doctor.totalReviews || 0} reviews)
                        </p>
                    </div>

                </div>

                <hr />

                <div className="doctor-info-grid">

                    <div>
                        <h4>Hospital</h4>
                        <p>{doctor.hospitalName}</p>
                    </div>

                    <div>
                        <h4>Location</h4>
                        <p>{doctor.city}</p>
                    </div>

                    <div>
                        <h4>Consultation Fee</h4>
                        <p>
                            ₹{doctor.price?.amount}
                        </p>
                    </div>

                    <div>
                        <h4>Languages</h4>
                        <p>
                            {doctor.languages?.join(", ")}
                        </p>
                    </div>

                </div>

                <div className="doctor-about">
                    <h2>About Doctor</h2>
                    <p>{doctor.about}</p>
                </div>

                <div className="booking-section">

                    <h2>Book an Appointment</h2>

                    <h3>Select Day</h3>

                    <div className="slot-list">
                        {doctor.availableDays?.map((day) => (
                            <button
                                key={day}
                                className={
                                    selectedDay === day
                                        ? "slot selected"
                                        : "slot"
                                }
                                onClick={() => {
                                    setSelectedDay(day);
                                    setSelectedSlot("");
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <h3>Select Time</h3>

                    <div className="slot-list">
                        {doctor.availableSlots?.map((slot) => (
                            <button
                                key={slot}
                                className={
                                    selectedSlot === slot
                                        ? "slot selected"
                                        : "slot"
                                }
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>

                    <div className="booking-summary">
                        <div>
                            <strong>Consultation</strong>
                            <span>Offline</span>
                        </div>

                        <div>
                            <strong>Fee</strong>
                            <span>₹{doctor.price?.amount}</span>
                        </div>
                    </div>

                    <button
                        className="book-button"
                        onClick={handleBooking}
                    >
                        Continue to Book
                    </button>

                </div>

            </div>
        </div>
    );
}

export default DoctorDetails;