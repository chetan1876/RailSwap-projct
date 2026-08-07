import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { womenSafetyAPI } from "../services/womenSafety.service";
import "../styles/womenSafety.css";

const EMERGENCY_KEYWORDS = [
  "help",
  "save me",
  "emergency",
  "danger",
  "attack",
  "accident",
  "hospital",
  "doctor",
  "police",
  "fire",
  "robbery",
  "kidnapping",
  "rape",
  "sos",
  "help please",
  "medical emergency",
  "unconscious",
  "bleeding",
];

const WomenSafetySOS = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const userId = user?.id || user?._id || user?.uid || "";

  const [formData, setFormData] = useState({
    passengerName: user?.name || user?.username || "",
    userId: userId,
    trainNumber: user?.trainNumber || "12951",
    coach: "B2",
    seatNumber: "21",
    mobileNumber: user?.phoneNumber || user?.phone || "",
    emergencyType: "Harassment / Safety Concern",
    emergencyDescription: "",
    currentLocation: "",
    dateTime: new Date().toLocaleString(),
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Update date & time live or on mount
    const timer = setInterval(() => {
      setFormData((prev) => ({ ...prev, dateTime: new Date().toLocaleString() }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setFormData((prev) => ({ ...prev, currentLocation: "Geolocation not supported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setFormData((prev) => ({
          ...prev,
          currentLocation: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        }));
      },
      (_err) => {
        setFormData((prev) => ({ ...prev, currentLocation: "Location permission denied" }));
      },
      { timeout: 5000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !token) {
      setErrorMessage("You must be logged in to send an SOS alert.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const emergencyMessage = `[${formData.emergencyType}] Passenger: ${formData.passengerName}, Train: ${formData.trainNumber}, Mobile: ${formData.mobileNumber}. Details: ${formData.emergencyDescription}`;

      const res = await womenSafetyAPI.raiseSOS(
        userId,
        {
          coach: formData.coach,
          seatNumber: formData.seatNumber,
          emergencyMessage,
          latitude,
          longitude,
        },
        token
      );

      setStatusMessage(res.data?.message || "🚨 Emergency SOS Sent Successfully! RPF & Emergency Team Notified.");
      setTimeout(() => {
        navigate("/women-safety");
      }, 2000);
    } catch (err) {
      setErrorMessage("Unable to send SOS: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceDetection = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "Speech Recognition API is unsupported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setStatusMessage("Listening...");
      setErrorMessage(null);

      recognition.onstart = () => {
        setStatusMessage("Listening...");
      };

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData((prev) => ({
          ...prev,
          emergencyDescription: transcript,
        }));
        setStatusMessage(`Voice detected... ("${transcript}")`);

        setTimeout(async () => {
          setStatusMessage("Processing...");

          const textLower = transcript.toLowerCase();
          const detectedKeyword = EMERGENCY_KEYWORDS.find((kw) =>
            textLower.includes(kw)
          );

          if (detectedKeyword) {
            setStatusMessage(
              `Emergency detected... ("${detectedKeyword}"). SOS Triggered...`
            );

            if (!userId || !token) {
              setErrorMessage(
                "Emergency keyword detected, but user authentication token is missing."
              );
              return;
            }

            try {
              setLoading(true);
              const emergencyMessage = `[VOICE EMERGENCY DETECTED] Keyword matched: "${detectedKeyword}" in transcript: "${transcript}". Passenger: ${formData.passengerName}, Train: ${formData.trainNumber}, Mobile: ${formData.mobileNumber}.`;

              const res = await womenSafetyAPI.raiseSOS(
                userId,
                {
                  coach: formData.coach || "B2",
                  seatNumber: formData.seatNumber || "21",
                  emergencyMessage,
                  latitude,
                  longitude,
                },
                token
              );

              setStatusMessage(
                res.data?.message ||
                  `🚨 SOS Triggered... Emergency keyword "${detectedKeyword}" detected from voice. RPF & Emergency Team Notified.`
              );
              setTimeout(() => {
                navigate("/women-safety");
              }, 2000);
            } catch (err) {
              setErrorMessage(
                "Unable to send SOS: " +
                  (err.response?.data?.message || err.message)
              );
            } finally {
              setLoading(false);
            }
          } else {
            setStatusMessage(
              `Voice detected: "${transcript}". No emergency keyword detected.`
            );
          }
        }, 800);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setErrorMessage(`Voice Recognition Error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMessage("Voice Recognition Failed: " + err.message);
    }
  };

  return (
    <div className="women-page">
      <div className="women-header">
        <h1>Women Safety Assistance</h1>
        <p>Emergency SOS Dispatch & Real-Time Incident Reporting</p>
      </div>

      <div className="women-form-card">
        <div className="women-form-header">
          <div>
            <h2>🚨 Emergency SOS Alert</h2>
            <p className="women-form-subtitle">Fill in details for instant RPF & Guardians dispatch</p>
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
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                className="women-form-input"
                value={formData.userId}
                readOnly
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
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                className="women-form-input"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="women-form-group">
              <label htmlFor="emergencyType">Emergency Type</label>
              <select
                id="emergencyType"
                name="emergencyType"
                className="women-form-select"
                value={formData.emergencyType}
                onChange={handleChange}
              >
                <option value="Harassment / Safety Concern">Harassment / Safety Concern</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Stalking / Following">Stalking / Following</option>
                <option value="Physical Threat">Physical Threat</option>
                <option value="Medical / Health Emergency">Medical / Health Emergency</option>
                <option value="Other Safety Issue">Other Safety Issue</option>
              </select>
            </div>

            <div className="women-form-group">
              <label htmlFor="dateTime">Date & Time (Auto-filled)</label>
              <input
                type="text"
                id="dateTime"
                name="dateTime"
                className="women-form-input"
                value={formData.dateTime}
                readOnly
              />
            </div>

            <div className="women-form-group full-width">
              <label htmlFor="currentLocation">Current Location (Optional)</label>
              <div className="location-input-wrapper">
                <input
                  type="text"
                  id="currentLocation"
                  name="currentLocation"
                  className="women-form-input"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  placeholder="e.g. Near Station / Coordinates"
                />
                <button type="button" onClick={handleFetchLocation}>
                  📍 Fetch Location
                </button>
              </div>
            </div>

            <div className="women-form-group full-width">
              <label htmlFor="emergencyDescription">Emergency Description</label>
              <textarea
                id="emergencyDescription"
                name="emergencyDescription"
                className="women-form-textarea"
                rows="4"
                value={formData.emergencyDescription}
                onChange={handleChange}
                placeholder="Describe the emergency or situation details..."
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
              type="button"
              className="sos-btn"
              onClick={handleVoiceDetection}
              disabled={loading || isListening}
            >
              {isListening ? "🎙️ Listening..." : "🎙️ Voice Emergency"}
            </button>
            <button
              type="submit"
              className="sos-btn"
              disabled={loading}
            >
              {loading ? "⏳ Submitting SOS..." : "🚨 Submit SOS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WomenSafetySOS;
