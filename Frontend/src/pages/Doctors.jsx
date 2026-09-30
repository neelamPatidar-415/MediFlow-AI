import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import { getDoctors } from "../services/api";

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        search: "",
        specialization: "",
        city: "",
        mode: "",
    });


    async function fetchDoctors() {
    try {
        setLoading(true);
        setError("");

        const result = await getDoctors(filters);

        console.log("DOCTORS RESULT:", result);

        const doctorList =
            Array.isArray(result)
                ? result
                : Array.isArray(result.data)
                    ? result.data
                    : Array.isArray(result.doctors)
                        ? result.doctors
                        : Array.isArray(result.data?.doctors)
                            ? result.data.doctors
                            : [];

        setDoctors(doctorList);

    } catch (err) {
        console.error("DOCTORS ERROR:", err);
        setError(err.message || "Unable to load doctors.");
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
        fetchDoctors();
    }, []);

    function handleChange(e) {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetchDoctors();
    }

    return (
        <div className="doctors-page">

            <div className="doctors-header">
                <h1>Find Doctors</h1>
                <p>Find the right doctor for your healthcare needs.</p>
            </div>

            <form className="doctor-search" onSubmit={handleSubmit}>
                <input
                    name="search"
                    placeholder="Search doctors, specializations..."
                    value={filters.search}
                    onChange={handleChange}
                />

                <input
                    name="specialization"
                    placeholder="Specialization"
                    value={filters.specialization}
                    onChange={handleChange}
                />

                <input
                    name="city"
                    placeholder="City"
                    value={filters.city}
                    onChange={handleChange}
                />

                <select
                    name="mode"
                    value={filters.mode}
                    onChange={handleChange}
                >
                    <option value="">All Modes</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="BOTH">Both</option>
                </select>

                <button type="submit">
                    Search
                </button>
            </form>

            <div className="doctors-content">

                <aside className="filters">
                    <h3>Filters</h3>

                    <button
                        onClick={() =>
                            setFilters({
                                search: "",
                                specialization: "",
                                city: "",
                                mode: "",
                            })
                        }
                    >
                        Clear All
                    </button>

                    <hr />

                    <h4>Mode of Consult</h4>
                    <p>Online & Offline consultations available</p>

                    <h4>Location</h4>
                    <p>Search by city</p>
                </aside>

                <main className="doctor-results">

                    <div className="results-heading">
                        <h2>Available Doctors</h2>
                        <span>{doctors.length} doctors</span>
                    </div>

                    {loading && <p>Loading doctors...</p>}

                    {error && <p className="error">{error}</p>}

                    {!loading && !error && doctors.length === 0 && (
                        <p>No doctors found.</p>
                    )}

                    {!loading &&
                        doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor._id}
                                doctor={doctor}
                            />
                        ))}
                </main>
            </div>
        </div>
    );
}

export default Doctors;