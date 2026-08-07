import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { womenSafetyAPI } from "../services/womenSafety.service";
import "../styles/womenSafety.css";

const WomenSafetyHelpline = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const userId = user?.id || user?._id || user?.uid || "";

  const [formData, setFormData] = useState({
    passengerName: user?.name || user?.username || "",
    phoneNumber: user?.phoneNumber || user?.phone || "",
    issue: "Women Safety Emergency Helpline",
    description: "",
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
      setErrorMessage("You must be logged in to reach the helpline.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const issuePayload = `[${formData.issue}] Passenger: ${formData.passengerName}. Details: ${formData.description}`;

      const res = await womenSafetyAPI.contactHelpline(
        userId,
        {
          issue: issuePayload,
          phoneNumber: formData.phoneNumber,
        },
        token
      );

      setStatusMessage(res.data?.message || "📞 Helpline Connected! Our Women Safety support team will contact you shortly.");
      setTimeout(() => {
        navigate("/women-safety");
      }, 2000);
    } catch (err) {
      setErrorMessage("Unable to connect Helpline: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="women-page">
      <div className="women-header">
        <h1>Women Helpline Support</h1>
        <p>24×7 Women Safety Emergency Toll-Free Support & Immediate Response</p>
      </div>

      <div className="women-form-card">
        <div className="women-form-header">
          <div>
            <h2>📞 Contact Women Helpline</h2>
            <p className="women-form-subtitle">Request a callback or assistance from the Women Helpline team</p>
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
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="women-form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
            </div>

            <div className="women-form-group full-width">
              <label htmlFor="issue">Issue Category</label>
              <select
                id="issue"
                name="issue"
                className="women-form-select"
                value={formData.issue}
                onChange={handleChange}
              >
                <option value="Women Safety Emergency Helpline">Women Safety Emergency Helpline (1091)</option>
                <option value="Railway Security Assistance">Railway Security Assistance (139)</option>
                <option value="Counseling / Emotional Support">Counseling / Emotional Support</option>
                <option value="Legal & Medical Guidance">Legal & Medical Guidance</option>
                <option value="General Safety Inquiry">General Safety Inquiry</option>
              </select>
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
                placeholder="Describe your concern or issue so our support team can assist you effectively..."
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
              {loading ? "⏳ Connecting Helpline..." : "📞 Call Helpline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WomenSafetyHelpline;
