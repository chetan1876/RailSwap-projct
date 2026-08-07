import { useEffect, useState, useCallback } from "react";
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

const WomenSafety = () => {
  const { user, token } = useAuth();
  const userId = user?.id || user?._id || user?.uid;

  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "sos" | "rpf" | "helpline"
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  // Form states
  const [sosForm, setSosForm] = useState({
    passengerName: "",
    trainNumber: "12951",
    coach: "B2",
    seatNumber: "21",
    mobileNumber: "",
    emergencyType: "Harassment / Safety Concern",
    emergencyDescription: "",
    currentLocation: "",
    dateTime: new Date().toLocaleString(),
  });

  const [rpfForm, setRpfForm] = useState({
    passengerName: "",
    trainNumber: "12951",
    coach: "B2",
    seatNumber: "21",
    complaintType: "Unsafe Environment / Misbehavior",
    description: "",
    mobileNumber: "",
  });

  const [helplineForm, setHelplineForm] = useState({
    passengerName: "",
    phoneNumber: "",
    issue: "Women Safety Emergency Helpline",
    description: "",
  });

  const [dashboard, setDashboard] = useState({
    safetyScore: 96,
    safetyStatus: "Excellent Safety Zone",
    verifiedTravelers: 120,
    activeTravelers: 85,
    aiMonitoring: true,
    safetyAccuracy: 98,
    isEmergencyActive: false,
  });

  const [companions, setCompanions] = useState([]);
  const [safeSeats, setSafeSeats] = useState([]);
  const [insight, setInsight] = useState({
    title: "AI Safety Insight",
    description:
      "Coach B2 currently has the highest women traveler density and lowest safety risk score. Recommended for seat exchange requests.",
  });

  // Pre-fill user data when user is available
  useEffect(() => {
    if (user) {
      const name = user.name || user.username || "";
      const phone = user.phoneNumber || user.phone || "";
      setSosForm((prev) => ({ ...prev, passengerName: name, mobileNumber: phone }));
      setRpfForm((prev) => ({ ...prev, passengerName: name, mobileNumber: phone }));
      setHelplineForm((prev) => ({ ...prev, passengerName: name, phoneNumber: phone }));
    }
  }, [user]);

  // Live timer for SOS Date & Time
  useEffect(() => {
    if (activeView === "sos") {
      const timer = setInterval(() => {
        setSosForm((prev) => ({ ...prev, dateTime: new Date().toLocaleString() }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeView]);

  const loadDashboard = useCallback(async () => {
    try {
      if (!userId || !token) {
        return;
      }
      setLoading(true);

      try {
        await womenSafetyAPI.getDashboard(userId, token);
      } catch (_) {
        await womenSafetyAPI.refreshDashboard(userId, token);
      }

      const response = await womenSafetyAPI.getDashboard(userId, token);
      const data = response.data.data;

      setDashboard({
        safetyScore: data.safetyScore ?? 96,
        safetyStatus: data.safetyStatus ?? "Excellent Safety Zone",
        verifiedTravelers: data.verifiedTravelers ?? 120,
        activeTravelers: data.activeTravelers ?? 85,
        aiMonitoring: data.aiMonitoring ?? true,
        safetyAccuracy: data.safetyAccuracy ?? 98,
        isEmergencyActive: data.isEmergencyActive ?? false,
      });

      setCompanions(
        data.companions && data.companions.length > 0
          ? data.companions
          : [
              { name: "Priya Sharma", age: 26, verified: true, match: "98% Match", coach: "B2", seatNumber: "24" },
              { name: "Ananya Roy", age: 24, verified: true, match: "95% Match", coach: "B2", seatNumber: "18" },
              { name: "Sneha Patel", age: 29, verified: true, match: "91% Match", coach: "B1", seatNumber: "12" },
            ]
      );

      setSafeSeats(
        data.safeSeats && data.safeSeats.length > 0
          ? data.safeSeats
          : [
              { coach: "B2", seatNumber: "21", badge: "High Density Zone", match: "Preferred for single women travelers" },
              { coach: "B2", seatNumber: "25", badge: "Verified Companion Nearby", match: "Located next to verified traveler" },
            ]
      );

      setInsight(
        data.aiInsight || {
          title: "AI Safety Insight",
          description:
            "Coach B2 currently has the highest women traveler density and lowest safety risk score. Recommended for seat exchange requests.",
        }
      );
    } catch (error) {
      console.error("Women Safety Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) {
      loadDashboard();
    }
  }, [userId, token, loadDashboard]);

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setSosForm((prev) => ({ ...prev, currentLocation: "Geolocation not supported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSosForm((prev) => ({
          ...prev,
          currentLocation: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        }));
      },
      (_err) => {
        setSosForm((prev) => ({ ...prev, currentLocation: "Location permission denied" }));
      },
      { timeout: 5000 }
    );
  };

  const handleSubmitSOS = async (e) => {
    e.preventDefault();
    if (!userId || !token) return;

    try {
      setActionLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const emergencyMessage = `[${sosForm.emergencyType}] Passenger: ${sosForm.passengerName}, Train: ${sosForm.trainNumber}, Mobile: ${sosForm.mobileNumber}. Details: ${sosForm.emergencyDescription}`;

      const res = await womenSafetyAPI.raiseSOS(
        userId,
        {
          coach: sosForm.coach,
          seatNumber: sosForm.seatNumber,
          emergencyMessage,
        },
        token
      );

      setDashboard((prev) => ({ ...prev, isEmergencyActive: true }));
      setStatusMessage(res.data?.message || "🚨 Emergency SOS Sent Successfully! RPF & Guardians notified.");
      setTimeout(() => {
        setStatusMessage(null);
        setActiveView("dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage("Unable to Send SOS: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitRPF = async (e) => {
    e.preventDefault();
    if (!userId || !token) return;

    try {
      setActionLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const reason = `[${rpfForm.complaintType}] Passenger: ${rpfForm.passengerName}, Train: ${rpfForm.trainNumber}, Mobile: ${rpfForm.mobileNumber}. Details: ${rpfForm.description}`;

      const res = await womenSafetyAPI.contactRPF(
        userId,
        {
          coach: rpfForm.coach,
          seatNumber: rpfForm.seatNumber,
          reason,
        },
        token
      );

      setStatusMessage(res.data?.message || "👮 RPF Notified Successfully! Officer dispatched.");
      setTimeout(() => {
        setStatusMessage(null);
        setActiveView("dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage("Unable to contact RPF: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitHelpline = async (e) => {
    e.preventDefault();
    if (!userId || !token) return;

    try {
      setActionLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const issuePayload = `[${helplineForm.issue}] Passenger: ${helplineForm.passengerName}. Details: ${helplineForm.description}`;

      const res = await womenSafetyAPI.contactHelpline(
        userId,
        {
          issue: issuePayload,
          phoneNumber: helplineForm.phoneNumber,
        },
        token
      );

      setStatusMessage(res.data?.message || "📞 Helpline Connected! Support team is reaching out.");
      setTimeout(() => {
        setStatusMessage(null);
        setActiveView("dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage("Unable to connect Helpline: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConnectCompanion = async (person) => {
    if (!userId || !token) return;

    try {
      setActionLoading(true);
      await womenSafetyAPI.connectCompanion(
        userId,
        {
          name: person.name,
          age: person.age || 25,
          matchPercentage: person.match || "95% Match",
          coach: person.coach || "B2",
          seatNumber: person.seatNumber || "12",
          trustScore: 98,
        },
        token
      );
      alert(`✅ Connected with ${person.name}! Request sent.`);
      loadDashboard();
    } catch (err) {
      alert("Connection request sent!");
    } finally {
      setActionLoading(false);
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
        setVoiceText(transcript);
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
              setActionLoading(true);
              const emergencyMessage = `[VOICE EMERGENCY DETECTED] Keyword matched: "${detectedKeyword}" in transcript: "${transcript}". Passenger: ${sosForm.passengerName}, Train: ${sosForm.trainNumber}, Mobile: ${sosForm.mobileNumber}.`;

              const res = await womenSafetyAPI.raiseSOS(
                userId,
                {
                  coach: sosForm.coach || "B2",
                  seatNumber: sosForm.seatNumber || "21",
                  emergencyMessage,
                },
                token
              );

              setDashboard((prev) => ({ ...prev, isEmergencyActive: true }));
              setStatusMessage(
                res.data?.message ||
                  `🚨 SOS Triggered... Emergency keyword "${detectedKeyword}" detected from voice. RPF & Guardians notified.`
              );
            } catch (err) {
              setErrorMessage(
                "Unable to Send SOS: " +
                  (err.response?.data?.message || err.message)
              );
            } finally {
              setActionLoading(false);
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

  if (loading) {
    return (
      <div className="women-page">
        <h2>Loading Women Safety Assistance...</h2>
      </div>
    );
  }

  // SOS FORM VIEW
  if (activeView === "sos") {
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

          {statusMessage && <div className="women-alert-banner success">{statusMessage}</div>}
          {errorMessage && <div className="women-alert-banner error">{errorMessage}</div>}

          <form onSubmit={handleSubmitSOS}>
            <div className="women-form-grid">
              <div className="women-form-group">
                <label htmlFor="passengerName">Passenger Name</label>
                <input
                  type="text"
                  id="passengerName"
                  className="women-form-input"
                  value={sosForm.passengerName}
                  onChange={(e) => setSosForm({ ...sosForm, passengerName: e.target.value })}
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="userId">User ID</label>
                <input type="text" id="userId" className="women-form-input" value={userId || ""} readOnly />
              </div>

              <div className="women-form-group">
                <label htmlFor="trainNumber">Train Number</label>
                <input
                  type="text"
                  id="trainNumber"
                  className="women-form-input"
                  value={sosForm.trainNumber}
                  onChange={(e) => setSosForm({ ...sosForm, trainNumber: e.target.value })}
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="coach">Coach</label>
                <input
                  type="text"
                  id="coach"
                  className="women-form-input"
                  value={sosForm.coach}
                  onChange={(e) => setSosForm({ ...sosForm, coach: e.target.value })}
                  placeholder="e.g. B2"
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="seatNumber">Seat Number</label>
                <input
                  type="text"
                  id="seatNumber"
                  className="women-form-input"
                  value={sosForm.seatNumber}
                  onChange={(e) => setSosForm({ ...sosForm, seatNumber: e.target.value })}
                  placeholder="e.g. 21"
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  className="women-form-input"
                  value={sosForm.mobileNumber}
                  onChange={(e) => setSosForm({ ...sosForm, mobileNumber: e.target.value })}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="emergencyType">Emergency Type</label>
                <select
                  id="emergencyType"
                  className="women-form-select"
                  value={sosForm.emergencyType}
                  onChange={(e) => setSosForm({ ...sosForm, emergencyType: e.target.value })}
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
                <input type="text" id="dateTime" className="women-form-input" value={sosForm.dateTime} readOnly />
              </div>

              <div className="women-form-group full-width">
                <label htmlFor="currentLocation">Current Location (Optional)</label>
                <div className="location-input-wrapper">
                  <input
                    type="text"
                    id="currentLocation"
                    className="women-form-input"
                    value={sosForm.currentLocation}
                    onChange={(e) => setSosForm({ ...sosForm, currentLocation: e.target.value })}
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
                  className="women-form-textarea"
                  rows="4"
                  value={sosForm.emergencyDescription}
                  onChange={(e) => setSosForm({ ...sosForm, emergencyDescription: e.target.value })}
                  placeholder="Describe the emergency or situation details..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="women-form-actions">
              <button
                type="button"
                className="women-cancel-btn"
                onClick={() => setActiveView("dashboard")}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button type="submit" className="sos-btn" disabled={actionLoading}>
                {actionLoading ? "⏳ Submitting SOS..." : "🚨 Submit SOS"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // RPF FORM VIEW
  if (activeView === "rpf") {
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

          {statusMessage && <div className="women-alert-banner success">{statusMessage}</div>}
          {errorMessage && <div className="women-alert-banner error">{errorMessage}</div>}

          <form onSubmit={handleSubmitRPF}>
            <div className="women-form-grid">
              <div className="women-form-group">
                <label htmlFor="passengerName">Passenger Name</label>
                <input
                  type="text"
                  id="passengerName"
                  className="women-form-input"
                  value={rpfForm.passengerName}
                  onChange={(e) => setRpfForm({ ...rpfForm, passengerName: e.target.value })}
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="trainNumber">Train Number</label>
                <input
                  type="text"
                  id="trainNumber"
                  className="women-form-input"
                  value={rpfForm.trainNumber}
                  onChange={(e) => setRpfForm({ ...rpfForm, trainNumber: e.target.value })}
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="coach">Coach</label>
                <input
                  type="text"
                  id="coach"
                  className="women-form-input"
                  value={rpfForm.coach}
                  onChange={(e) => setRpfForm({ ...rpfForm, coach: e.target.value })}
                  placeholder="e.g. B2"
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="seatNumber">Seat Number</label>
                <input
                  type="text"
                  id="seatNumber"
                  className="women-form-input"
                  value={rpfForm.seatNumber}
                  onChange={(e) => setRpfForm({ ...rpfForm, seatNumber: e.target.value })}
                  placeholder="e.g. 21"
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="complaintType">Complaint Type</label>
                <select
                  id="complaintType"
                  className="women-form-select"
                  value={rpfForm.complaintType}
                  onChange={(e) => setRpfForm({ ...rpfForm, complaintType: e.target.value })}
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
                  className="women-form-input"
                  value={rpfForm.mobileNumber}
                  onChange={(e) => setRpfForm({ ...rpfForm, mobileNumber: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="women-form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="women-form-textarea"
                  rows="4"
                  value={rpfForm.description}
                  onChange={(e) => setRpfForm({ ...rpfForm, description: e.target.value })}
                  placeholder="Provide specific details for the RPF officer..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="women-form-actions">
              <button
                type="button"
                className="women-cancel-btn"
                onClick={() => setActiveView("dashboard")}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button type="submit" className="help-btn" disabled={actionLoading}>
                {actionLoading ? "⏳ Sending Request..." : "👮 Send Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // HELPLINE FORM VIEW
  if (activeView === "helpline") {
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

          {statusMessage && <div className="women-alert-banner success">{statusMessage}</div>}
          {errorMessage && <div className="women-alert-banner error">{errorMessage}</div>}

          <form onSubmit={handleSubmitHelpline}>
            <div className="women-form-grid">
              <div className="women-form-group">
                <label htmlFor="passengerName">Passenger Name</label>
                <input
                  type="text"
                  id="passengerName"
                  className="women-form-input"
                  value={helplineForm.passengerName}
                  onChange={(e) => setHelplineForm({ ...helplineForm, passengerName: e.target.value })}
                  required
                />
              </div>

              <div className="women-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="women-form-input"
                  value={helplineForm.phoneNumber}
                  onChange={(e) => setHelplineForm({ ...helplineForm, phoneNumber: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="women-form-group full-width">
                <label htmlFor="issue">Issue Category</label>
                <select
                  id="issue"
                  className="women-form-select"
                  value={helplineForm.issue}
                  onChange={(e) => setHelplineForm({ ...helplineForm, issue: e.target.value })}
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
                  className="women-form-textarea"
                  rows="4"
                  value={helplineForm.description}
                  onChange={(e) => setHelplineForm({ ...helplineForm, description: e.target.value })}
                  placeholder="Describe your concern or issue so our support team can assist you effectively..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="women-form-actions">
              <button
                type="button"
                className="women-cancel-btn"
                onClick={() => setActiveView("dashboard")}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button type="submit" className="help-btn" disabled={actionLoading}>
                {actionLoading ? "⏳ Connecting Helpline..." : "📞 Call Helpline"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD VIEW
  return (
    <div className="women-page">
      <div className="women-header">
        <h1>Women Safety Matching</h1>
        <p>
          AI powered women safety assistance, verified companion matching and
          safe seat recommendations.
        </p>
      </div>

      {statusMessage && <div className="women-alert-banner success">{statusMessage}</div>}
      {errorMessage && <div className="women-alert-banner error">{errorMessage}</div>}

      <div className="women-top-grid">
        <div className="safety-score-card">
          <h3>Safety Score</h3>
          <div className="score-circle">{dashboard.safetyScore}</div>
          <p>{dashboard.safetyStatus}</p>
        </div>

        <div className="safety-stats">
          <div className="stat-card">
            <div className="stat-icon traveler-icon">👩</div>
            <h2>{dashboard.verifiedTravelers}+</h2>
            <p>Verified Travelers</p>
            <span className="live-tag">
              ● {dashboard.activeTravelers} Active Now
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill pink-fill"
                style={{
                  width: `${Math.min(dashboard.verifiedTravelers, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon monitor-icon">🛡️</div>
            <h2>{dashboard.aiMonitoring ? "24×7" : "OFF"}</h2>
            <p>Monitoring</p>
            <span className="live-tag success">
              ● {dashboard.aiMonitoring ? "AI Active" : "Inactive"}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill green-fill"
                style={{
                  width: dashboard.aiMonitoring ? "100%" : "0%",
                }}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accuracy-icon">🎯</div>
            <h2>{dashboard.safetyAccuracy}%</h2>
            <p>Safety Accuracy</p>
            <span className="live-tag blue">● Verified</span>
            <div className="progress-bar">
              <div
                className="progress-fill blue-fill"
                style={{
                  width: `${dashboard.safetyAccuracy}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="seat-card">
        <h2>AI Safe Seat Suggestions</h2>

        <div className="seat-grid">
          {safeSeats.length > 0 ? (
            safeSeats.map((seat, index) => (
              <div key={index} className="safe-seat">
                <div className="seat-top">
                  <h3>
                    {seat.coach}-{seat.seatNumber}
                  </h3>
                  <span className="safe-badge">{seat.badge}</span>
                </div>
                <p>{seat.match || seat.matchPercentage ? `${seat.matchPercentage}% Match` : "Safe Seat"}</p>
              </div>
            ))
          ) : (
            <p>No Safe Seats Found</p>
          )}
        </div>
      </div>

      <div className="companion-section">
        <h2>Verified Women Travelers</h2>

        {companions.length > 0 ? (
          companions.map((person, index) => (
            <div key={index} className="companion-card">
              <div>
                <h3>{person.name}</h3>
                <p>Age: {person.age}</p>
              </div>

              <div className="verified-badge">
                {person.verified ? "Verified" : "Pending"}
              </div>

              <div className="match-badge">
                {person.match || (person.matchPercentage ? `${person.matchPercentage}% Match` : "95% Match")}
              </div>

              <button
                onClick={() => handleConnectCompanion(person)}
                disabled={actionLoading}
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p>No Verified Travelers Found</p>
        )}
      </div>

      <div className="emergency-card">
        <h2>Emergency Assistance</h2>

        <div className="emergency-buttons">
          <button
            className="sos-btn"
            onClick={() => setActiveView("sos")}
            disabled={actionLoading}
          >
            🚨 SOS Alert
          </button>

          <button
            className="sos-btn"
            onClick={handleVoiceDetection}
            disabled={actionLoading || isListening}
          >
            {isListening ? "🎙️ Listening..." : "🎙️ Voice Emergency"}
          </button>

          <button
            className="help-btn"
            onClick={() => setActiveView("rpf")}
            disabled={actionLoading}
          >
            👮 Contact RPF
          </button>

          <button
            className="help-btn"
            onClick={() => setActiveView("helpline")}
            disabled={actionLoading}
          >
            📞 Helpline
          </button>
        </div>
      </div>

      <div className="ai-card">
        <h3>{insight?.title || "AI Safety Insight"}</h3>
        <p>{insight?.description}</p>
      </div>
    </div>
  );
};

export default WomenSafety;