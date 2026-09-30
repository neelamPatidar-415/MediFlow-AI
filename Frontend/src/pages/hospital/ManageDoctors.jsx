import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getHospitalDoctors,
    updateDoctor,
    deleteDoctor,
} from "../../services/api";

function ManageDoctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingDoctor, setEditingDoctor] = useState(null);

    async function loadDoctors() {
        try {
            setLoading(true);
            setError("");

            const result = await getHospitalDoctors();
            setDoctors(result.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDoctors();
    }, []);

    async function handleDelete(id) {
        if (!window.confirm("Delete this doctor?")) return;

        try {
            await deleteDoctor(id);
            await loadDoctors();
        } catch (err) {
            setError(err.message);
        }
    }

async function handleUpdate(e) {
    e.preventDefault();

    try {
        const data = new FormData();

        data.append("name", editingDoctor.name);
        data.append("specialization", editingDoctor.specialization);
        data.append("qualification", editingDoctor.qualification);
        data.append("experience", editingDoctor.experience);

        data.append("price[amount]", editingDoctor.price.amount);
        data.append("price[currency]", editingDoctor.price.currency);

        data.append("hospitalName", editingDoctor.hospitalName);
        data.append("city", editingDoctor.city);
        data.append("mode", editingDoctor.mode);

        editingDoctor.availableDays?.forEach((day) => {
            data.append("availableDays", day);
        });

        editingDoctor.availableSlots?.forEach((slot) => {
            data.append("availableSlots", slot);
        });

        editingDoctor.languages?.forEach((language) => {
            data.append("languages", language);
        });

        data.append("about", editingDoctor.about || "");
        data.append(
            "isAvailable",
            String(editingDoctor.isAvailable)
        );

        await updateDoctor(editingDoctor._id, data);

        setEditingDoctor(null);
        await loadDoctors();

    } catch (err) {
        console.error("UPDATE FRONTEND ERROR:", err);
        setError(err.message);
    }
}

    if (loading) {
        return (
            <div className="page-message">
                <h2>Loading doctors...</h2>
            </div>
        );
    }

    return (
        <div className="hospital-page">

            <div className="hospital-page-header">
                <div>
                    <h1>Manage Doctors</h1>
                    <p>{doctors.length} doctor{doctors.length !== 1 ? "s" : ""}</p>
                </div>

                <button
                    className="home-primary-button"
                    onClick={() => navigate("/hospital/doctors/create")}
                >
                    + Add Doctor
                </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {doctors.length === 0 ? (
                <div className="page-message">
                    <h2>No doctors yet</h2>
                    <p>Add your first doctor to get started.</p>
                </div>
            ) : (
                <div className="hospital-doctors-grid">

                    {doctors.map((doctor) => (
                        <div className="hospital-doctor-card" key={doctor._id}>

                            {doctor.profileImage?.url ? (
                                <img
                                    src={doctor.profileImage.url}
                                    alt={doctor.name}
                                    className="hospital-doctor-image"
                                />
                            ) : (
                                <div className="hospital-doctor-placeholder">
                                    {doctor.name?.charAt(0)}
                                </div>
                            )}

                            <div className="hospital-doctor-info">
                                <h2>{doctor.name}</h2>

                                <p className="doctor-specialization">
                                    {doctor.specialization}
                                </p>

                                <p>
                                    {doctor.qualification} • {doctor.experience} yrs
                                </p>

                                <p>
                                    ₹{doctor.price?.amount} • {doctor.mode}
                                </p>

                                <p>
                                    {doctor.city}
                                </p>

                                <span className={
                                    doctor.isAvailable
                                        ? "doctor-status available"
                                        : "doctor-status unavailable"
                                }>
                                    {doctor.isAvailable ? "Available" : "Unavailable"}
                                </span>
                            </div>

                            <div className="hospital-doctor-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() => setEditingDoctor({
                                        ...doctor,
                                        availableDays: [...(doctor.availableDays || [])],
                                        availableSlots: [...(doctor.availableSlots || [])],
                                        languages: [...(doctor.languages || [])],
                                    })}
                                >
                                    Edit
                                </button>

                                <button
                                    className="cancel-button"
                                    onClick={() => handleDelete(doctor._id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            )}

            {editingDoctor && (
                <div className="hospital-modal-overlay">

                    <div className="hospital-modal">

                        <div className="hospital-modal-header">
                            <h2>Edit Doctor</h2>

                            <button
                                onClick={() => setEditingDoctor(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate}>

                            <div className="hospital-form-grid">

                                <div className="auth-field">
                                    <label>Name</label>
                                    <input
                                        value={editingDoctor.name}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Specialization</label>
                                    <input
                                        value={editingDoctor.specialization}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                specialization: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Qualification</label>
                                    <input
                                        value={editingDoctor.qualification}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                qualification: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Experience</label>
                                    <input
                                        type="number"
                                        value={editingDoctor.experience}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                experience: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Fee</label>
                                    <input
                                        type="number"
                                        value={editingDoctor.price?.amount || ""}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                price: {
                                                    ...editingDoctor.price,
                                                    amount: e.target.value,
                                                },
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Mode</label>
                                    <select
                                        value={editingDoctor.mode}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                mode: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="BOTH">Both</option>
                                        <option value="ONLINE">Online</option>
                                        <option value="OFFLINE">Offline</option>
                                    </select>
                                </div>

                                <div className="auth-field">
                                    <label>Hospital Name</label>
                                    <input
                                        value={editingDoctor.hospitalName}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                hospitalName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>City</label>
                                    <input
                                        value={editingDoctor.city}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                city: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Available Days</label>
                                    <input
                                        value={editingDoctor.availableDays.join(", ")}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                availableDays: e.target.value
                                                    .split(",")
                                                    .map((x) => x.trim())
                                                    .filter(Boolean),
                                            })
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Available Slots</label>
                                    <input
                                        value={editingDoctor.availableSlots.join(", ")}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                availableSlots: e.target.value
                                                    .split(",")
                                                    .map((x) => x.trim())
                                                    .filter(Boolean),
                                            })
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Languages</label>
                                    <input
                                        value={editingDoctor.languages.join(", ")}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                languages: e.target.value
                                                    .split(",")
                                                    .map((x) => x.trim())
                                                    .filter(Boolean),
                                            })
                                        }
                                    />
                                </div>

                                <div className="auth-field">
                                    <label>Availability</label>
                                    <select
                                        value={editingDoctor.isAvailable}
                                        onChange={(e) =>
                                            setEditingDoctor({
                                                ...editingDoctor,
                                                isAvailable: e.target.value === "true",
                                            })
                                        }
                                    >
                                        <option value="true">Available</option>
                                        <option value="false">Unavailable</option>
                                    </select>
                                </div>

                            </div>

                            <div className="auth-field">
                                <label>About</label>
                                <textarea
                                    rows="4"
                                    value={editingDoctor.about || ""}
                                    onChange={(e) =>
                                        setEditingDoctor({
                                            ...editingDoctor,
                                            about: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="hospital-form-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setEditingDoctor(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="home-primary-button"
                                >
                                    Save Changes
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default ManageDoctors;