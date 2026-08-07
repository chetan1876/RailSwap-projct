import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/womenSafety.css";

const WomenSafetyDoctor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    passengerName: user?.name || user?.username || "",
    trainNumber: user?.trainNumber || "12951",
    coach: "B2",
    seatNumber: "21",
    medicalProblem: "",
    severity: "Moderate",
    preferredLanguage: "English",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Call backend endpoint for Women Safety Find Doctor when available
    // Currently submitting form and notifying user.

    setTimeout(() => {
      setStatusMessage("🏥 Medical Request Submitted! Searching nearby doctors and medical volunteers on your train.");
      setLoading(false);

      setTimeout(() => {
        navigate("/women-safety");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="women-page">
      <div className="women-header">
        <h1>On-Board Emergency Doctor Match</h1>
        <p>Find Verified Doctors & Medical Professionals Traveling On Your Train</p>
      </div>

      <div className="women-form-card">
        <div className="women-form-header">
          <div>
            <h2>🏥 Find Doctor Assistance</h2>
            <p className="women-form-subtitle">Enter details to match with nearby doctors and medical assistance</p>
          </div>
        </div>

        {statusMessage && (
          <div className="women-alert-banner success">{statusMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="women-form-grid">
            <div className="women-form-group">
              <label htmlFor="passengerName">Passenger Name</label>
              <input
                type="text"
                id="passengerName"
                name="passengerName"
                className="women-form-input"
                value={formData.passengerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="women-form-group">
              <label htmlFor="trainNumber">Train Number</label>
              <input
                type="text"
                id="trainNumber"
                name="trainNumber"
                className="women-form-input"
                value={formData.trainNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="women-form-group">
              <label htmlFor="coach">Coach</label>
              <input
                type="text"
                id="coach"
                name="coach"
                className="women-form-input"
                value={formData.coach}
                onChange={handleChange}
                placeholder="e.g. B2"
                required
              />
            </div>

            <div className="women-form-group">
              <label htmlFor="seatNumber">Seat Number</label>
              <input
                type="text"
                id="seatNumber"
                name="seatNumber"
                className="women-form-input"
                value={formData.seatNumber}
                onChange={handleChange}
                placeholder="e.g. 21"
                required
              />
            </div>

            <div className="women-form-group">
              <label htmlFor="severity">Severity Level</label>
              <select
                id="severity"
                name="severity"
                className="women-form-select"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="Mild">Mild (General Consultation)</option>
                <option value="Moderate">Moderate (Discomfort / Pain)</option>
                <option value="Severe">Severe (Urgent Attention)</option>
                <option value="Critical Emergency">Critical Emergency</option>
              </select>
            </div>

            <div className="women-form-group">
              <label htmlFor="preferredLanguage">Preferred Language</label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                className="women-form-select"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="women-form-group full-width">
              <label htmlFor="medicalProblem">Medical Problem</label>
              <textarea
                id="medicalProblem"
                name="medicalProblem"
                className="women-form-textarea"
                rows="4"
                value={formData.medicalProblem}
                onChange={handleChange}
                placeholder="Describe symptoms, medical condition or health emergency..."
                required
              ></textarea>
            </div>
          </div>

          <div className="women-form-actions">
            <button
              type="button"
              className="women-cancel-btn"
              onClick={() => navigate("/women-safety")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="help-btn"
              disabled={loading}
            >
              {loading ? "⏳ Searching Doctors..." : "🏥 Find Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WomenSafetyDoctor;
