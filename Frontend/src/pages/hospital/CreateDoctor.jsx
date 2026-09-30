import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDoctor } from "../../services/api";

function CreateDoctor() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        specialization: "",
        qualification: "",
        experience: "",
        price: "",
        currency: "INR",
        hospitalName: "",
        city: "",
        mode: "BOTH",
        availableDays: "",
        availableSlots: "",
        languages: "",
        about: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            const data = new FormData();

            data.append("name", form.name);
            data.append("specialization", form.specialization);
            data.append("qualification", form.qualification);
            data.append("experience", form.experience);

            data.append("price[amount]", form.price);
            data.append("price[currency]", form.currency);

            data.append("hospitalName", form.hospitalName);
            data.append("city", form.city);
            data.append("mode", form.mode);

            form.availableDays
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((day) => data.append("availableDays", day));

            form.availableSlots
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((slot) => data.append("availableSlots", slot));

            form.languages
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((language) => data.append("languages", language));

            data.append("about", form.about);

            if (profileImage) {
                data.append("profileImage", profileImage);
            }

            await createDoctor(data);

            navigate("/hospital/doctors");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="hospital-page">
            <div className="hospital-page-header">
                <div>
                    <h1>Add Doctor</h1>
                    <p>Create a new doctor profile for your hospital.</p>
                </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form className="hospital-form" onSubmit={handleSubmit}>

                <div className="hospital-form-grid">

                    <div className="auth-field">
                        <label>Doctor Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Specialization</label>
                        <input
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Qualification</label>
                        <input
                            name="qualification"
                            value={form.qualification}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Experience (years)</label>
                        <input
                            type="number"
                            min="0"
                            name="experience"
                            value={form.experience}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Consultation Fee</label>
                        <input
                            type="number"
                            min="0"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Currency</label>
                        <select
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>

                    <div className="auth-field">
                        <label>Hospital Name</label>
                        <input
                            name="hospitalName"
                            value={form.hospitalName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>City</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Mode</label>
                        <select
                            name="mode"
                            value={form.mode}
                            onChange={handleChange}
                        >
                            <option value="BOTH">Both</option>
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                        </select>
                    </div>

                    <div className="auth-field">
                        <label>Available Days</label>
                        <input
                            name="availableDays"
                            value={form.availableDays}
                            onChange={handleChange}
                            placeholder="Monday, Wednesday, Friday"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Available Slots</label>
                        <input
                            name="availableSlots"
                            value={form.availableSlots}
                            onChange={handleChange}
                            placeholder="10:00 AM, 11:00 AM, 2:00 PM"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Languages</label>
                        <input
                            name="languages"
                            value={form.languages}
                            onChange={handleChange}
                            placeholder="English, Hindi"
                        />
                    </div>

                </div>

                <div className="auth-field">
                    <label>About Doctor</label>
                    <textarea
                        name="about"
                        value={form.about}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="auth-field">
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                </div>

                <div className="hospital-form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate("/hospital/doctors")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="home-primary-button"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Doctor"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default CreateDoctor;