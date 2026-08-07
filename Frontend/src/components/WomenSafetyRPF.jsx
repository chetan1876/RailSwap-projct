import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { womenSafetyAPI } from "../services/womenSafety.service";
import "../styles/womenSafety.css";

const WomenSafetyRPF = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const userId = user?.id || user?._id || user?.uid || "";

  const [formData, setFormData] = useState({
    passengerName: user?.name || user?.username || "",
    trainNumber: user?.trainNumber || "12951",
    coach: "B2",
    seatNumber: "21",
    complaintType: "Unsafe Environment / Misbehavior",
    description: "",
    mobileNumber: user?.phoneNumber || user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !token) {
      setErrorMessage("You must be logged in to contact RPF.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const reason = `[${formData.complaintType}] Passenger: ${formData.passengerName}, Train: ${formData.trainNumber}, Mobile: ${formData.mobileNumber}. Details: ${formData.description}`;

      const res = await womenSafetyAPI.contactRPF(
        userId,
        {
          coach: formData.coach,
          seatNumber: formData.seatNumber,
          reason,
        },
        token
      );

      setStatusMessage(res.data?.message || "👮 RPF Request Sent Successfully! An officer is being dispatched.");
      setTimeout(() => {
        navigate("/women-safety");
      }, 2000);
    } catch (err) {
      setErrorMessage("Unable to contact RPF: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="women-page">
      <div className="women-header">
        <h1>Railway Protection Force (RPF) Assistance</h1>
        <p>Direct Security Request & On-Train Officer Dispatch</p>
      </div>

      <div className="women-form-card">
        <div className="women-form-header">
          <div>
            <h2>👮 Contact RPF Officer</h2>
            <p className="women-form-subtitle">Submit details to summon RPF personnel to your coach</p>
          </div>
        </div>

        {statusMessage && (
          <div className="women-alert-banner success">{statusMessage}</div>
        )}

        {errorMessage && (
          <div className="women-alert-banner error">{errorMessage}</div>
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
              <label htmlFor="complaintType">Complaint Type</label>
              <select
                id="complaintType"
                name="complaintType"
                className="women-form-select"
                value={formData.complaintType}
                onChange={handleChange}
              >
                <option value="Unsafe Environment / Misbehavior">Unsafe Environment / Misbehavior</option>
                <option value="Unauthorized Person in Coach">Unauthorized Person in Coach</option>
                <option value="Noise / Disturbance">Noise / Disturbance</option>
                <option value="Theft / Security Threat">Theft / Security Threat</option>
                <option value="Escort Request">Escort Request</option>
                <option value="Other Assistance">Other Assistance</option>
              </select>
            </div>

            <div className="women-form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                className="women-form-input"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
            </div>

            <div className="women-form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="women-form-textarea"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide specific details for the RPF officer..."
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
              {loading ? "⏳ Sending Request..." : "👮 Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WomenSafetyRPF;
