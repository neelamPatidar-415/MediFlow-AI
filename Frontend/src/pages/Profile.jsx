import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/api";
import defaultProfile from "../assets/default-profile.png";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const result = await getCurrentUser();
                setUser(result.user);
            } catch {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [navigate]);

    async function handleLogout() {
        try {
            await logoutUser();
        } catch (err) {
            console.error(err);
        }

        navigate("/");
    }

    if (loading) {
        return (
            <div className="page-message">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <img className="user-avatar" src={defaultProfile} alt="Profile" />

            <div>
              <h1>{user.fullName}</h1>
              <p>
                {user.role === "hospital_admin"
                  ? "Hospital Administrator"
                  : "Patient"}
              </p>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-item">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            {/* <div className="profile-item">
              <span>Phone</span>
              <strong>{user.phone}</strong>
            </div> */}

            <div className="profile-item">
              <span>Account Type</span>
              <strong>
                {user.role === "hospital_admin" ? "Hospital Admin" : "Patient"}
              </strong>
            </div>

            {user.role === "hospital_admin" && user.hospitalName && (
              <div className="profile-item">
                <span>Hospital</span>
                <strong>{user.hospitalName}</strong>
              </div>
            )}
          </div>

          <button className="profile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
}

export default Profile;