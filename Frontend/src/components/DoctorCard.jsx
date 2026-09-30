import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
    const image =
        doctor.profileImage?.url ||
        "https://via.placeholder.com/90x90?text=Doctor";

    return (
        <div className="doctor-card">
            <img src={image} alt={doctor.name} className="doctor-image" />

            <div className="doctor-info">
                <h3>{doctor.name}</h3>

                <p className="specialization">
                    {doctor.specialization}
                </p>

                <p>
                    {doctor.experience} years • {doctor.qualification}
                </p>

                <p className="hospital">
                    {doctor.hospitalName}, {doctor.city}
                </p>

                <div className="doctor-bottom">
                    <div>
                        ⭐ {doctor.rating || 0}
                        <span> ({doctor.totalReviews || 0})</span>
                    </div>

                    <strong>
                        ₹{doctor.price?.amount}
                    </strong>

                    <Link to={`/doctors/${doctor._id}`}>
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DoctorCard;