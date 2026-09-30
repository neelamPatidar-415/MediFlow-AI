import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/api";

function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then((result) => {
                setUser(result.user || result);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    const isHospitalAdmin =
        user?.role === "hospital_admin";

    return (
        <div className="home-page">

            <section className="home-hero">

                <div className="home-hero-content">

                    <span className="home-badge">
                        Healthcare, simplified
                    </span>

                    <h1>
                        {isHospitalAdmin
                            ? "Manage your hospital,"
                            : "Find the right care,"}
                        <br />
                        <span>
                            {isHospitalAdmin
                                ? "all in one place."
                                : "when you need it."}
                        </span>
                    </h1>

                    <p>
                        {isHospitalAdmin
                            ? "Manage doctors, monitor appointments and get meaningful insights into your hospital operations."
                            : "Discover doctors, check availability, and book appointments with ease."}
                    </p>

                    <div className="home-actions">

                        {isHospitalAdmin ? (
                            <Link
                                to="/hospital"
                                className="home-primary-button"
                            >
                                Hospital Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/doctors"
                                    className="home-primary-button"
                                >
                                    Find a Doctor →
                                </Link>

                                <Link
                                    to="/appointments"
                                    className="home-secondary-button"
                                >
                                    My Appointments
                                </Link>
                            </>
                        )}

                    </div>

                </div>

                <div className="home-visual">

                    <div className="health-card">

                        <div className="health-card-top">
                            <span>PulsePilot</span>
                            <span className="health-status">
                                ●
                            </span>
                        </div>

                        <div className="health-icon">
                            {isHospitalAdmin ? "⌂" : "♥"}
                        </div>

                        <h3>
                            {isHospitalAdmin
                                ? "Your hospital,"
                                : "Your care,"}
                            <br />
                            all in one place.
                        </h3>

                        <p>
                            {isHospitalAdmin
                                ? "Doctors, appointments and hospital insights."
                                : "Find doctors and manage your appointments easily."}
                        </p>

                    </div>

                </div>

            </section>

            <section className="home-features">

                <div className="home-feature">
                    <div className="feature-icon">
                        {isHospitalAdmin ? "✚" : "⌕"}
                    </div>

                    <div>
                        <h3>
                            {isHospitalAdmin
                                ? "Manage Doctors"
                                : "Find Doctors"}
                        </h3>

                        <p>
                            {isHospitalAdmin
                                ? "Add and manage doctors working in your hospital."
                                : "Search doctors by specialization, city and availability."}
                        </p>
                    </div>
                </div>

                <div className="home-feature">
                    <div className="feature-icon">✓</div>

                    <div>
                        <h3>
                            {isHospitalAdmin
                                ? "Appointments"
                                : "Easy Booking"}
                        </h3>

                        <p>
                            {isHospitalAdmin
                                ? "Monitor appointments and booking activity."
                                : "Choose an available slot and confirm your appointment."}
                        </p>
                    </div>
                </div>

                <div className="home-feature">
                    <div className="feature-icon">
                        {isHospitalAdmin ? "◈" : "♡"}
                    </div>

                    <div>
                        <h3>
                            {isHospitalAdmin
                                ? "Hospital Insights"
                                : "Stay Organized"}
                        </h3>

                        <p>
                            {isHospitalAdmin
                                ? "View useful analytics about your hospital."
                                : "Keep your appointments and healthcare journey together."}
                        </p>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default Home;