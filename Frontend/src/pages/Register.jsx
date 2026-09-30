import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import logo from "../assets/pulsepilot-logo.png";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "patient",
        hospitalName: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: form.role,
            };

            if (form.role === "hospital_admin") {
                data.hospitalName = form.hospitalName;
            }

            await registerUser(data);

            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-brand">
                    <img
                        src={logo}
                        alt="PulsePilot"
                    />

                    <div>
                        <h1>PulsePilot</h1>
                        <p>Healthcare, simplified.</p>
                    </div>
                </div>

                <div className="auth-heading">
                    <h2>Create your account</h2>
                    <p>Join PulsePilot and manage healthcare with ease.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="auth-field">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="auth-row">

                        <div className="auth-field">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label>Phone</label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                required
                            />
                        </div>

                    </div>

                    <div className="auth-field">
                        <label>Account Type</label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="patient">
                                Patient
                            </option>

                            <option value="hospital_admin">
                                Hospital Admin
                            </option>
                        </select>
                    </div>

                    {form.role === "hospital_admin" && (
                        <div className="auth-field">
                            <label>Hospital Name</label>

                            <input
                                type="text"
                                name="hospitalName"
                                value={form.hospitalName}
                                onChange={handleChange}
                                placeholder="Enter hospital name"
                                required
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;