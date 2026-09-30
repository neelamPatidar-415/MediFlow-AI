import { Link } from "react-router-dom";
import logo from "../assets/pulsepilot-logo.png";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-inner">

                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <img
                            src={logo}
                            alt="PulsePilot"
                        />
                        <span>PulsePilot</span>
                    </Link>

                    <p>
                        Simple, connected healthcare
                        for every step of your journey.
                    </p>
                </div>

                <div className="footer-links">

                    <div>
                        <h4>PulsePilot</h4>

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/doctors">
                            Find Doctors
                        </Link>

                        <Link to="/appointments">
                            Appointments
                        </Link>
                    </div>

                    <div>
                        <h4>Account</h4>

                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Get Started
                        </Link>

                        <Link to="/profile">
                            Profile
                        </Link>
                    </div>

                </div>

            </div>

            <div className="footer-bottom">
                {new Date().getFullYear()} PulsePilot. All rights reserved.
            </div>

        </footer>
    );
}

export default Footer;