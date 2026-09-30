import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* Hero */}
            <section className="home-hero">

                <div className="home-hero-content">

                    <span className="home-badge">
                        Healthcare, simplified
                    </span>

                    <h1>
                        Find the right care,
                        <br />
                        <span>when you need it.</span>
                    </h1>

                    <p>
                        Discover doctors, check availability, and
                        book appointments with ease.
                    </p>

                    <div className="home-actions">
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
                            ♥
                        </div>

                        <h3>
                            Your care,
                            <br />
                            all in one place.
                        </h3>

                        <p>
                            Find doctors and manage
                            your appointments easily.
                        </p>

                    </div>

                </div>

            </section>

            {/* Features */}
            <section className="home-features">

                <div className="home-feature">
                    <div className="feature-icon">⌕</div>

                    <div>
                        <h3>Find Doctors</h3>
                        <p>
                            Search doctors by specialization,
                            city and availability.
                        </p>
                    </div>
                </div>

                <div className="home-feature">
                    <div className="feature-icon">✓</div>

                    <div>
                        <h3>Easy Booking</h3>
                        <p>
                            Choose an available slot and
                            confirm your appointment.
                        </p>
                    </div>
                </div>

                <div className="home-feature">
                    <div className="feature-icon">♡</div>

                    <div>
                        <h3>Stay Organized</h3>
                        <p>
                            Keep your appointments and
                            healthcare journey together.
                        </p>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default Home;