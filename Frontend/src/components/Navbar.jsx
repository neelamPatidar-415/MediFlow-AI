import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/api";
import logo from "../assets/pulsepilot-logo.png";
import defaultProfile from "../assets/default-profile.png";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function checkUser() {
            try {
                const result = await getCurrentUser();
                setUser(result.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkUser();

        window.addEventListener("auth-change", checkUser);

        return () => {
            window.removeEventListener("auth-change", checkUser);
        };
    }, []);

    async function handleLogout() {
        try {
            await logoutUser();
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
            navigate("/");
        }
    }

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    const isHospitalAdmin = user?.role === "hospital_admin";

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* LOGO */}
                <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
                    <img src={logo} alt="PulsePilot" />
                    <span>PulsePilot</span>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="navbar-links">
                    <Link to="/">Home</Link>

                    {isHospitalAdmin ? (
                        <>
                            <Link to="/hospital/doctors">
                                Manage Doctors
                            </Link>

                            <Link to="/hospital/appointments">
                                Appointments
                            </Link>

                            <Link to="/hospital/bookings">
                                Bookings
                            </Link>

                            <Link to="/hospital/analytics">
                                Analytics
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/doctors">
                                Find Doctors
                            </Link>

                            {user && (
                                <Link to="/my-appointments">
                                    My Appointments
                                </Link>
                            )}

                            {user && (
                                <Link to="/bookings">
                                    My Bookings
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* DESKTOP ACTIONS */}
                <div className="navbar-actions">

                    {!loading && !user && (
                        <>
                            <Link to="/login" className="navbar-login">
                                Login
                            </Link>

                            <Link to="/register" className="navbar-register">
                                Get Started
                            </Link>
                        </>
                    )}

                    {!loading && user && (
                        <div className="navbar-user">

                            <button
                                className="user-button"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <img
                                    className="user-avatar"
                                    src={defaultProfile}
                                    alt="Profile"
                                />

                                <span className="user-name">
                                    {user.fullName}
                                </span>

                                <span className="user-arrow">
                                    {userMenuOpen ? "▲" : "▼"}
                                </span>
                            </button>

                            {userMenuOpen && (
                                <div className="user-menu">

                                    <Link
                                        to="/profile"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    {isHospitalAdmin ? (
                                        <>
                                            <Link
                                                to="/hospital/doctors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Manage Doctors
                                            </Link>

                                            <Link
                                                to="/hospital/doctors/create"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Add Doctor
                                            </Link>

                                            <Link
                                                to="/hospital/analytics"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Analytics
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/my-appointments"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                My Appointments
                                            </Link>

                                            <Link
                                                to="/bookings"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                My Bookings
                                            </Link>
                                        </>
                                    )}

                                    <button onClick={handleLogout}>
                                        Logout
                                    </button>

                                </div>
                            )}
                        </div>
                    )}

                    {/* MOBILE BUTTON */}
                    <button
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Open menu"
                    >
                        {mobileMenuOpen ? "✕" : "☰"}
                    </button>

                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="mobile-menu">

                    <Link to="/" onClick={closeMobileMenu}>
                        Home
                    </Link>

                    {isHospitalAdmin ? (
                        <>
                            <Link
                                to="/hospital/doctors"
                                onClick={closeMobileMenu}
                            >
                                Manage Doctors
                            </Link>

                            <Link
                                to="/hospital/doctors/create"
                                onClick={closeMobileMenu}
                            >
                                Add Doctor
                            </Link>

                            <Link
                                to="/hospital/appointments"
                                onClick={closeMobileMenu}
                            >
                                Appointments
                            </Link>

                            <Link
                                to="/hospital/bookings"
                                onClick={closeMobileMenu}
                            >
                                Bookings
                            </Link>

                            <Link
                                to="/hospital/analytics"
                                onClick={closeMobileMenu}
                            >
                                Analytics
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/doctors"
                                onClick={closeMobileMenu}
                            >
                                Find Doctors
                            </Link>

                            {user && (
                                <>
                                    <Link
                                        to="/my-appointments"
                                        onClick={closeMobileMenu}
                                    >
                                        My Appointments
                                    </Link>

                                    <Link
                                        to="/bookings"
                                        onClick={closeMobileMenu}
                                    >
                                        My Bookings
                                    </Link>
                                </>
                            )}
                        </>
                    )}

                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                onClick={closeMobileMenu}
                            >
                                Profile
                            </Link>

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="mobile-register"
                                onClick={closeMobileMenu}
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                </div>
            )}
        </nav>
    );
}

export default Navbar;