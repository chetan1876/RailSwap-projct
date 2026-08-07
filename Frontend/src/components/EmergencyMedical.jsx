import "../styles/emergencyMedical.css";
import { useEffect, useState, useCallback } from "react";
import { emergencyMedicalAPI } from "../services/emergencyMedical.service";
import { useAuth } from "../context/AuthContext";

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

const EmergencyMedical = () => {
  const { token, user } = useAuth();
  const userId = user?.id || user?._id || user?.uid;

  // View state: "dashboard" | "sos" | "find-doctor"
  const [activeView, setActiveView] = useState("dashboard");

  // Dashboard state
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Button loading states
  const [sosLoading, setSosLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(null); // doctorId being contacted
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Status & Error messages
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form States
  const [sosForm, setSosForm] = useState({
    patientName: "",
    coach: "B2",
    seatNumber: "18",
    emergencyType: "MEDICAL",
    message: "",
    mobileNumber: "",
    currentLocation: "",
    dateTime: new Date().toLocaleString(),
  });

  const [doctorForm, setDoctorForm] = useState({
    patientName: "",
    trainNumber: "12951",
    coach: "B2",
    seatNumber: "18",
    medicalProblem: "",
    severity: "Moderate",
    preferredLanguage: "English",
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      const name = user.name || user.username || "";
      const phone = user.phoneNumber || user.phone || "";
      setSosForm((prev) => ({ ...prev, patientName: name, mobileNumber: phone }));
      setDoctorForm((prev) => ({ ...prev, patientName: name }));
    }
  }, [user]);

  // Live timer for Date & Time
  useEffect(() => {
    if (activeView === "sos") {
      const timer = setInterval(() => {
        setSosForm((prev) => ({ ...prev, dateTime: new Date().toLocaleString() }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeView]);

  /*
  ==============================
  FETCH / INITIALIZE DASHBOARD
  ==============================
  */
  const fetchDashboard = useCallback(async () => {
    if (!token || !userId) return;
    try {
      setLoading(true);
      await emergencyMedicalAPI.initializeDashboard(userId, token);
      const res = await emergencyMedicalAPI.getDashboard(userId, token);
      setDashboard(res.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /*
  ==============================
  EMERGENCY SOS FORM SUBMIT
  ==============================
  */
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setSosForm((prev) => ({ ...prev, currentLocation: "Geolocation not supported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
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
    if (!token || !userId) return;

    try {
      setSosLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      await emergencyMedicalAPI.raiseSOS(
        userId,
        {
          coach: sosForm.coach,
          seatNumber: sosForm.seatNumber,
          patientName: sosForm.patientName,
          emergencyType: sosForm.emergencyType,
          message: sosForm.message,
          latitude,
          longitude,
        },
        token
      );

      setStatusMessage("🚨 Emergency SOS Raised! Medical help & responders are on the way.");
      setTimeout(() => {
        setStatusMessage(null);
        setActiveView("dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage("SOS Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSosLoading(false);
    }
  };

  /*
  ==============================
  FIND DOCTOR FORM SUBMIT
  ==============================
  */
  const handleSubmitFindDoctor = async (e) => {
    e.preventDefault();
    if (!token || !userId) return;

    try {
      setRefreshLoading(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const res = await emergencyMedicalAPI.refreshDashboard(userId, token);
      setDashboard(res.data.data);

      setStatusMessage("👨‍⚕️ Search completed! Nearby doctors & medical experts matched on your train.");
      setTimeout(() => {
        setStatusMessage(null);
        setActiveView("dashboard");
      }, 2000);
    } catch (err) {
      setErrorMessage("Find Doctor Error: " + (err.response?.data?.message || err.message));
    } finally {
      setRefreshLoading(false);
    }
  };

  /*
  ==============================
  CONTACT DOCTOR
  ==============================
  */
  const handleContactDoctor = async (doctor) => {
    if (!token || !userId) return;

    const patientName = window.prompt("Enter patient name:");
    if (!patientName) return;

    const emergencyType = window.prompt(
      "Emergency type (MEDICAL / ACCIDENT / HEART ATTACK / BLEEDING / OTHER):"
    ) || "MEDICAL";

    try {
      setContactLoading(doctor.id);
      await emergencyMedicalAPI.contactDoctor(
        userId,
        { doctorId: doctor.id, patientName, emergencyType },
        token
      );
      window.alert(`✅ Dr. ${doctor.name} has been notified!`);
    } catch (err) {
      window.alert(
        "Contact Error: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setContactLoading(null);
    }
  };

  /*
  ==============================
  NEAREST HOSPITAL (Geolocation + Google Maps)
  ==============================
  */
  const handleNearestHospital = () => {
    setHospitalLoading(true);
    if (!navigator.geolocation) {
      window.open(
        "https://www.google.com/maps/search/hospitals+near+me",
        "_blank"
      );
      setHospitalLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},14z`;
        window.open(mapsUrl, "_blank");
        setHospitalLoading(false);
      },
      (_err) => {
        window.open(
          "https://www.google.com/maps/search/hospitals+near+me",
          "_blank"
        );
        setHospitalLoading(false);
      },
      { timeout: 8000 }
    );
  };

  /*
  ==============================
  VOICE EMERGENCY DETECTION
  ==============================
  */
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

            if (!token || !userId) {
              setErrorMessage(
                "Emergency keyword detected, but user authentication token is missing."
              );
              return;
            }

            try {
              setSosLoading(true);
              const message = `[VOICE EMERGENCY DETECTED] Keyword matched: "${detectedKeyword}" in transcript: "${transcript}". Patient: ${sosForm.patientName || user?.name || "Patient"}.`;

              await emergencyMedicalAPI.raiseSOS(
                userId,
                {
                  coach: sosForm.coach || "B2",
                  seatNumber: sosForm.seatNumber || "18",
                  patientName: sosForm.patientName || user?.name || "Patient",
                  emergencyType: "MEDICAL",
                  message,
                  latitude,
                  longitude,
                },
                token
              );

              setStatusMessage(
                `🚨 SOS Triggered... Emergency keyword "${detectedKeyword}" detected from voice. Medical help & responders are on the way.`
              );
            } catch (err) {
              setErrorMessage(
                "SOS Error: " + (err.response?.data?.message || err.message)
              );
            } finally {
              setSosLoading(false);
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

  /*
  ==============================
  DERIVE DISPLAY VALUES FROM BACKEND
  ==============================
  */
  const responseTime = dashboard?.responseTime ?? "—";
  const stats = dashboard?.statistics || {};
  const doctorsNearby = stats.doctorsNearby ?? "—";
  const availableDoctors = stats.availableDoctors ?? "—";
  const medicalVolunteers = stats.medicalVolunteers ?? "—";
  const emergencySupport = stats.emergencySupport ?? "—";
  const doctors = dashboard?.doctors || [];
  const donors = dashboard?.donors || [];
  const aiInsight = dashboard?.aiInsight || null;

  const doctorFillWidth =
    doctorsNearby !== "—"
      ? `${Math.min((availableDoctors / doctorsNearby) * 100, 100)}%`
      : "0%";
  const volunteerFillWidth =
    medicalVolunteers !== "—"
      ? `${Math.min((medicalVolunteers / 150) * 100, 100)}%`
      : "0%";

  // EMERGENCY SOS FORM VIEW
  if (activeView === "sos") {
    return (
      <div className="medical-page">
        <div className="medical-header">
          <h1>Emergency Medical SOS</h1>
          <p>Instant On-Board Medical Emergency Dispatch & Alert System</p>
        </div>

        <div className="medical-form-card">
          <div className="medical-form-header">
            <div>
              <h2>🚨 Raise Emergency SOS</h2>
              <p className="medical-form-subtitle">Fill in patient details for immediate medical assistance</p>
            </div>
          </div>

          {statusMessage && <div className="medical-alert-banner success">{statusMessage}</div>}
          {errorMessage && <div className="medical-alert-banner error">{errorMessage}</div>}

          <form onSubmit={handleSubmitSOS}>
            <div className="medical-form-grid">
              <div className="medical-form-group">
                <label htmlFor="patientName">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  className="medical-form-input"
                  value={sosForm.patientName}
                  onChange={(e) => setSosForm({ ...sosForm, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  className="medical-form-input"
                  value={sosForm.mobileNumber}
                  onChange={(e) => setSosForm({ ...sosForm, mobileNumber: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="coach">Coach</label>
                <input
                  type="text"
                  id="coach"
                  className="medical-form-input"
                  value={sosForm.coach}
                  onChange={(e) => setSosForm({ ...sosForm, coach: e.target.value })}
                  placeholder="e.g. B2"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="seatNumber">Seat Number</label>
                <input
                  type="text"
                  id="seatNumber"
                  className="medical-form-input"
                  value={sosForm.seatNumber}
                  onChange={(e) => setSosForm({ ...sosForm, seatNumber: e.target.value })}
                  placeholder="e.g. 18"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="emergencyType">Emergency Type</label>
                <select
                  id="emergencyType"
                  className="medical-form-select"
                  value={sosForm.emergencyType}
                  onChange={(e) => setSosForm({ ...sosForm, emergencyType: e.target.value })}
                >
                  <option value="MEDICAL">General Medical Emergency</option>
                  <option value="ACCIDENT">Accident / Injury</option>
                  <option value="HEART ATTACK">Heart Attack / Chest Pain</option>
                  <option value="BLEEDING">Severe Bleeding</option>
                  <option value="OTHER">Other Health Issue</option>
                </select>
              </div>

              <div className="medical-form-group">
                <label htmlFor="dateTime">Date & Time (Auto-filled)</label>
                <input
                  type="text"
                  id="dateTime"
                  className="medical-form-input"
                  value={sosForm.dateTime}
                  readOnly
                />
              </div>

              <div className="medical-form-group full-width">
                <label htmlFor="currentLocation">Current Location (Optional)</label>
                <div className="location-input-wrapper">
                  <input
                    type="text"
                    id="currentLocation"
                    className="medical-form-input"
                    value={sosForm.currentLocation}
                    onChange={(e) => setSosForm({ ...sosForm, currentLocation: e.target.value })}
                    placeholder="e.g. Current Station / Coordinates"
                  />
                  <button type="button" onClick={handleFetchLocation}>
                    📍 Fetch Location
                  </button>
                </div>
              </div>

              <div className="medical-form-group full-width">
                <label htmlFor="message">Additional Message / Medical Description</label>
                <textarea
                  id="message"
                  className="medical-form-textarea"
                  rows="4"
                  value={sosForm.message}
                  onChange={(e) => setSosForm({ ...sosForm, message: e.target.value })}
                  placeholder="Describe patient symptoms or emergency condition..."
                ></textarea>
              </div>
            </div>

            <div className="medical-form-actions">
              <button
                type="button"
                className="medical-cancel-btn"
                onClick={() => setActiveView("dashboard")}
                disabled={sosLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sos-btn"
                onClick={handleVoiceDetection}
                disabled={sosLoading || isListening}
              >
                {isListening ? "🎙️ Listening..." : "🎙️ Voice Emergency"}
              </button>
              <button type="submit" className="sos-btn" disabled={sosLoading}>
                {sosLoading ? "⏳ Submitting SOS..." : "🚨 Submit Emergency SOS"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // FIND DOCTOR FORM VIEW
  if (activeView === "find-doctor") {
    return (
      <div className="medical-page">
        <div className="medical-header">
          <h1>Find Emergency Doctor</h1>
          <p>Match with On-Board Doctors & Medical Volunteers Traveling On Your Train</p>
        </div>

        <div className="medical-form-card">
          <div className="medical-form-header">
            <div>
              <h2>👨‍⚕️ Find Doctor Request</h2>
              <p className="medical-form-subtitle">Submit details to locate nearby doctors and medical experts</p>
            </div>
          </div>

          {statusMessage && <div className="medical-alert-banner success">{statusMessage}</div>}
          {errorMessage && <div className="medical-alert-banner error">{errorMessage}</div>}

          <form onSubmit={handleSubmitFindDoctor}>
            <div className="medical-form-grid">
              <div className="medical-form-group">
                <label htmlFor="patientName">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  className="medical-form-input"
                  value={doctorForm.patientName}
                  onChange={(e) => setDoctorForm({ ...doctorForm, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="trainNumber">Train Number</label>
                <input
                  type="text"
                  id="trainNumber"
                  className="medical-form-input"
                  value={doctorForm.trainNumber}
                  onChange={(e) => setDoctorForm({ ...doctorForm, trainNumber: e.target.value })}
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="coach">Coach</label>
                <input
                  type="text"
                  id="coach"
                  className="medical-form-input"
                  value={doctorForm.coach}
                  onChange={(e) => setDoctorForm({ ...doctorForm, coach: e.target.value })}
                  placeholder="e.g. B2"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="seatNumber">Seat Number</label>
                <input
                  type="text"
                  id="seatNumber"
                  className="medical-form-input"
                  value={doctorForm.seatNumber}
                  onChange={(e) => setDoctorForm({ ...doctorForm, seatNumber: e.target.value })}
                  placeholder="e.g. 18"
                  required
                />
              </div>

              <div className="medical-form-group">
                <label htmlFor="severity">Severity Level</label>
                <select
                  id="severity"
                  className="medical-form-select"
                  value={doctorForm.severity}
                  onChange={(e) => setDoctorForm({ ...doctorForm, severity: e.target.value })}
                >
                  <option value="Mild">Mild (General Consultation)</option>
                  <option value="Moderate">Moderate (Discomfort / Pain)</option>
                  <option value="Severe">Severe (Urgent Attention)</option>
                  <option value="Critical Emergency">Critical Emergency</option>
                </select>
              </div>

              <div className="medical-form-group">
                <label htmlFor="preferredLanguage">Preferred Language</label>
                <select
                  id="preferredLanguage"
                  className="medical-form-select"
                  value={doctorForm.preferredLanguage}
                  onChange={(e) => setDoctorForm({ ...doctorForm, preferredLanguage: e.target.value })}
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

              <div className="medical-form-group full-width">
                <label htmlFor="medicalProblem">Medical Problem / Description</label>
                <textarea
                  id="medicalProblem"
                  className="medical-form-textarea"
                  rows="4"
                  value={doctorForm.medicalProblem}
                  onChange={(e) => setDoctorForm({ ...doctorForm, medicalProblem: e.target.value })}
                  placeholder="Describe patient symptoms, medical condition or assistance needed..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="medical-form-actions">
              <button
                type="button"
                className="medical-cancel-btn"
                onClick={() => setActiveView("dashboard")}
                disabled={refreshLoading}
              >
                Cancel
              </button>
              <button type="submit" className="doctor-btn" disabled={refreshLoading}>
                {refreshLoading ? "⏳ Searching Doctors..." : "👨‍⚕️ Find Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD VIEW
  return (
    <div className="medical-page">
      <div className="medical-header">
        <h1>Emergency Medical Match</h1>
        <p>
          Connect instantly with doctors, medical volunteers and blood donors
          during emergencies.
        </p>
      </div>

      {statusMessage && <div className="medical-alert-banner success">{statusMessage}</div>}
      {errorMessage && <div className="medical-alert-banner error">{errorMessage}</div>}

      <div className="medical-top-grid">
        <div className="medical-score-card">
          <h3>Emergency Response</h3>
          <div className="medical-circle">
            {loading ? "..." : `${responseTime} Min`}
          </div>
          <p>Average Response Time</p>
        </div>

        <div className="medical-stats">
          <div className="medical-stat-card">
            <div className="stat-icon doctor-icon">👨‍⚕️</div>
            <h2>{loading ? "..." : doctorsNearby}</h2>
            <p>Doctors Nearby</p>
            <span className="status online">
              ● {loading ? "..." : `${availableDoctors} Available Now`}
            </span>
            <div className="progress">
              <div
                className="progress-fill doctor-fill"
                style={{ width: loading ? "0%" : doctorFillWidth }}
              ></div>
            </div>
            <small>Average Arrival : {loading ? "..." : `${responseTime} min`}</small>
          </div>

          <div className="medical-stat-card">
            <div className="stat-icon volunteer-icon">🩺</div>
            <h2>{loading ? "..." : medicalVolunteers}</h2>
            <p>Medical Volunteers</p>
            <span className="status success">● Active in Train</span>
            <div className="progress">
              <div
                className="progress-fill volunteer-fill"
                style={{ width: loading ? "0%" : volunteerFillWidth }}
              ></div>
            </div>
            <small>
              {loading
                ? "..."
                : `${Math.round(medicalVolunteers * 0.68)} Ready to Help`}
            </small>
          </div>

          <div className="medical-stat-card">
            <div className="stat-icon support-icon">📞</div>
            <h2>{loading ? "..." : `${emergencySupport}×7`}</h2>
            <p>Emergency Support</p>
            <span className="status emergency">● Always Online</span>
            <div className="progress">
              <div
                className="progress-fill support-fill"
                style={{ width: "100%" }}
              ></div>
            </div>
            <small>Instant AI Assistance</small>
          </div>
        </div>
      </div>

      <div className="sos-card">
        <h2>Emergency Actions</h2>

        <div className="sos-buttons">
          <button
            className="sos-btn"
            onClick={() => setActiveView("sos")}
            disabled={sosLoading || loading}
          >
            🚨 Emergency SOS
          </button>

          <button
            className="sos-btn"
            onClick={handleVoiceDetection}
            disabled={sosLoading || loading || isListening}
          >
            {isListening ? "🎙️ Listening..." : "🎙️ Voice Emergency"}
          </button>

          <button
            className="doctor-btn"
            onClick={() => setActiveView("find-doctor")}
            disabled={refreshLoading || loading}
          >
            👨‍⚕️ Find Doctor
          </button>

          <button
            className="hospital-btn"
            onClick={handleNearestHospital}
            disabled={hospitalLoading}
          >
            {hospitalLoading ? "⏳ Locating..." : "🏥 Nearest Hospital"}
          </button>
        </div>
      </div>

      <div className="doctor-section">
        <h2>Nearby Medical Experts</h2>

        {loading && <p>Loading doctors...</p>}

        {!loading && doctors.length === 0 && (
          <p>No doctors available. Click &quot;Find Doctor&quot; to search.</p>
        )}

        {!loading &&
          doctors.map((doctor, index) => (
            <div key={doctor.id || index} className="doctor-card">
              <div>
                <h3>{doctor.name}</h3>
                <p>{doctor.speciality}</p>
              </div>

              <span>Coach {doctor.coach}</span>

              <button
                onClick={() => handleContactDoctor(doctor)}
                disabled={contactLoading === doctor.id}
              >
                {contactLoading === doctor.id ? "Contacting..." : "Contact"}
              </button>
            </div>
          ))}
      </div>

      <div className="blood-card">
        <h2>Blood Donor Match</h2>

        <div className="blood-header">
          <span>Required Blood Group</span>
          <strong>
            {donors.length > 0 ? donors[0].blood : "—"}
          </strong>
        </div>

        {loading && <p>Loading donors...</p>}

        {!loading && donors.length === 0 && (
          <p>No donors found. Click &quot;Find Doctor&quot; to refresh.</p>
        )}

        {!loading &&
          donors.map((donor, index) => (
            <div key={donor.id || index} className="donor-card">
              <div>
                <h3>{donor.name}</h3>
                <p>Coach {donor.coach}</p>
              </div>

              <span className="blood-badge">{donor.blood}</span>
            </div>
          ))}
      </div>

      <div className="medical-ai-card">
        <h3>AI Medical Insight</h3>
        <p>
          {loading
            ? "Loading AI insight..."
            : aiInsight?.description ||
              "Nearest medical assistance is available within your nearby coaches."}
        </p>
      </div>
    </div>
  );
};

export default EmergencyMedical;