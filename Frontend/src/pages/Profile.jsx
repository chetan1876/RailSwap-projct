import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>
          Manage your account information and profile details.
        </p>
      </div>

      <div className="profile-container">

        {/* Left Section */}
        <div className="profile-card">

          <div className="profile-top">
            <img
              src={`https://ui-avatars.com/api/?name=${
                encodeURIComponent(
                  user?.fullName || "RailSwap User"
                )
              }&background=2563EB&color=fff&size=128`}
              alt="Profile"
            />

            <div>
              <h2>{user?.fullName || "RailSwap User"}</h2>
              <p>
                {user?.role === "ADMIN"
                  ? "Administrator"
                  : "Verified Passenger"}
              </p>
            </div>
          </div>

          <div className="profile-details">

            <div className="detail-box">
              <span>Full Name</span>
              <h4>
                {user?.fullName || "Not Available"}
              </h4>
            </div>

            <div className="detail-box">
              <span>Email Address</span>
              <h4>
                {user?.email || "Not Available"}
              </h4>
            </div>

            <div className="detail-box">
              <span>Mobile Number</span>
              <h4>
                {user?.phoneNumber || "Not Added"}
              </h4>
            </div>

            <div className="detail-box">
              <span>Role</span>
              <h4>
                {user?.role || "USER"}
              </h4>
            </div>

            <div className="detail-box">
              <span>Account Status</span>
              <h4>
                {user?.isVerified
                  ? "Verified"
                  : "Pending Verification"}
              </h4>
            </div>

          </div>

          <button className="primary-action-btn">
            Edit Profile
          </button>

        </div>

        {/* Right Section */}
        <div className="trust-score-card">

          <h3>Trust Score</h3>

          <div className="score-circle">
            92
          </div>

          <p>
            Excellent passenger trust rating based on successful
            journey interactions and verified exchanges.
          </p>

          <div className="trust-info">

            <div>
              <strong>15+</strong>
              <span>Trips</span>
            </div>

            <div>
              <strong>98%</strong>
              <span>Positive</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;