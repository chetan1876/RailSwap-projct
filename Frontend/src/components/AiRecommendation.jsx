import React, { useState, useEffect } from "react";
import { aiRecommendationAPI } from "../services/aiRecommendation.service";
import "../styles/aiRecommendation.css";

// SVG Brand Logos / Icons for Booking Partners
function ProviderIcon({ type }) {
  switch (type) {
    case "irctc":
      return (
        <svg
          viewBox="0 0 40 40"
          width="34"
          height="34"
          className="partner-svg-logo"
        >
          <circle cx="20" cy="20" r="18" fill="#0f4c81" />
          <path
            d="M12 27 V15 L20 11 L28 15 V27 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="3.5" fill="#ffcc00" />
        </svg>
      );
    case "paytm":
      return (
        <svg
          viewBox="0 0 40 40"
          width="34"
          height="34"
          className="partner-svg-logo"
        >
          <rect width="40" height="40" rx="8" fill="#002970" />
          <text
            x="4"
            y="25"
            fontSize="11"
            fontWeight="900"
            fill="#00baf2"
            fontFamily="sans-serif"
          >
            paytm
          </text>
        </svg>
      );
    case "confirmtkt":
      return (
        <svg
          viewBox="0 0 40 40"
          width="34"
          height="34"
          className="partner-svg-logo"
        >
          <rect width="40" height="40" rx="8" fill="#15803d" />
          <path
            d="M10 21 L17 28 L30 12"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "railyatri":
      return (
        <svg
          viewBox="0 0 40 40"
          width="34"
          height="34"
          className="partner-svg-logo"
        >
          <rect width="40" height="40" rx="8" fill="#d97706" />
          <path
            d="M10 26 H30 M14 14 L20 22 L26 14"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ixigo":
      return (
        <svg
          viewBox="0 0 40 40"
          width="34"
          height="34"
          className="partner-svg-logo"
        >
          <rect width="40" height="40" rx="8" fill="#be185d" />
          <text
            x="5"
            y="25"
            fontSize="12"
            fontWeight="800"
            fill="#ffffff"
            fontFamily="sans-serif"
          >
            ixigo
          </text>
        </svg>
      );
    case "amazonpay":
      return (
        <svg
          viewBox="0 0 40 40"
          width="34"
          height="34"
          className="partner-svg-logo"
        >
          <rect width="40" height="40" rx="8" fill="#232f3e" />
          <text
            x="6"
            y="20"
            fontSize="11"
            fontWeight="bold"
            fill="#ff9900"
            fontFamily="sans-serif"
          >
            pay
          </text>
          <path
            d="M8 26 Q 20 32 32 26"
            fill="none"
            stroke="#ff9900"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <i
          className="fa-solid fa-train text-blue"
          style={{ fontSize: "24px" }}
        ></i>
      );
  }
}

// Fallback booking providers list if backend API is initializing
const DEFAULT_PROVIDERS = [
  {
    id: "irctc",
    name: "IRCTC Official",
    tagline: "Official Indian Railways e-Ticketing Portal",
    badge: "Official Partner",
    badgeColor: "#1a56db",
    brandColor: "#0f4c81",
    logoType: "irctc",
    description:
      "Direct booking with official IRCTC credentials. Zero markup fee.",
    features: [
      "Official IRCTC Booking",
      "Direct Cancellation",
      "Loyalty Rewards",
    ],
  },
  {
    id: "paytm",
    name: "Paytm Trains",
    tagline: "Instant Refunds & Zero Payment Gateway Fee",
    badge: "Instant Refund",
    badgeColor: "#00baf2",
    brandColor: "#002970",
    logoType: "paytm",
    description: "Fastest checkout with Paytm UPI, Wallet, or Credit Cards.",
    features: [
      "Zero Gateway Fee",
      "Instant Refund to Wallet",
      "Live Status Tracking",
    ],
  },
  {
    id: "confirmtkt",
    name: "ConfirmTkt",
    tagline: "Same Train Alternate Berth & WL Confirmation Predictor",
    badge: "WL Predictor",
    badgeColor: "#22c55e",
    brandColor: "#15803d",
    logoType: "confirmtkt",
    description:
      "Get highest ticket confirmation chances and alternate berth recommendations.",
    features: [
      "99% WL Prediction",
      "Same Train Alternate Berth",
      "Free Cancellation Pass",
    ],
  },
  {
    id: "railyatri",
    name: "RailYatri",
    tagline: "Smart Coach Location & Live Station Tracking",
    badge: "Smart Seats",
    badgeColor: "#f59e0b",
    brandColor: "#d97706",
    logoType: "railyatri",
    description:
      "Book tickets along with meal delivery and coach position prediction.",
    features: [
      "Coach Position Map",
      "E-Catering Delivery",
      "24x7 Customer Help",
    ],
  },
  {
    id: "ixigo",
    name: "ixigo Trains",
    tagline: "Zero Agent Service Charges & Free Cancellation Option",
    badge: "Free Cancel",
    badgeColor: "#ec4899",
    brandColor: "#be185d",
    logoType: "ixigo",
    description:
      "Instant booking confirmation with full refund on cancellation.",
    features: [
      "Assured Instant Refund",
      "Zero Gateway Charge",
      "PNR Status Alerts",
    ],
  },
  {
    id: "amazonpay",
    name: "Amazon Pay Trains",
    tagline: "Cashback Rewards & One-Click Amazon Pay Balance Checkout",
    badge: "Amazon Cashback",
    badgeColor: "#ff9900",
    brandColor: "#232f3e",
    logoType: "amazonpay",
    description:
      "Seamless train booking with Amazon Pay balance and prime rewards.",
    features: [
      "Amazon Pay Balance",
      "Exclusive Cashbacks",
      "Prime Member Perks",
    ],
  },
];

function AiRecommendation() {
  const [activeTab, setActiveTab] = useState("generate"); // "generate" | "history"
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    travelDate: "",
    travelClass: "ALL",
    passengers: 1,
    budget: "",
    preferences: {
      seatPreference: "No Preference",
      classPreference: "No Preference",
      fastest: false,
      cheapest: false,
      leastCrowded: false,
      familyFriendly: false,
      studentFriendly: false,
      seniorFriendly: false,
      womenFriendly: false,
      overnightTravel: false,
      dayTravel: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date" | "score"
  const [filterBookmark, setFilterBookmark] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isFallbackNotice, setIsFallbackNotice] = useState(false);

  // Booking Modal & Partner States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingTrainDetails, setBookingTrainDetails] = useState(null);
  const [selectedQuota, setSelectedQuota] = useState("GN");
  const [providersList, setProvidersList] = useState(DEFAULT_PROVIDERS);
  const [selectedProviderId, setSelectedProviderId] = useState("irctc");
  const [bookingProcessing, setBookingProcessing] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");

  // Fetch history and booking providers on component mount
  useEffect(() => {
    fetchHistory();
    fetchBookingProviders();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await aiRecommendationAPI.getHistory();
      if (response.success) {
        setHistory(response.data || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchBookingProviders = async () => {
    try {
      const response = await aiRecommendationAPI.getBookingProviders();
      if (response.success && response.data && response.data.length > 0) {
        setProvidersList(response.data);
      }
    } catch (err) {
      console.error("Using default booking providers configuration:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: !prev.preferences[name],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setCurrentResult(null);

    try {
      const response =
        await aiRecommendationAPI.generateRecommendation(formData);
      if (response.success) {
        setCurrentResult(response.data);
        // If backend used fallback recommendations, show a friendly info notice (not a scary error)
        if (response.data?.isFallback) {
          setIsFallbackNotice(true);
          setErrorMsg(
            response.data.fallbackReason ||
              "AI service is temporarily unavailable. Showing smart recommendations based on available railway data."
          );
        } else {
          setIsFallbackNotice(false);
          setSuccessMsg("AI Recommendations generated successfully!");
        }
        fetchHistory(); // Refresh history log list
      } else {
        // Backend returned non-success but we still have no data — show friendly notice
        setIsFallbackNotice(true);
        setErrorMsg(
          "AI service is temporarily unavailable. Showing smart recommendations based on available railway data."
        );
      }
    } catch (err) {
      console.error("[AiRecommendation] generateRecommendation error:", err);
      // Never show raw Gemini/API errors to the user
      setIsFallbackNotice(true);
      setErrorMsg(
        "AI service is temporarily unavailable. Showing smart recommendations based on available railway data."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleBookmark = async (id) => {
    try {
      const response = await aiRecommendationAPI.bookmark(id);
      if (response.success) {
        setHistory((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, isBookmarked: response.data.isBookmarked }
              : item,
          ),
        );
        if (currentResult && currentResult.id === id) {
          setCurrentResult((prev) => ({
            ...prev,
            isBookmarked: response.data.isBookmarked,
          }));
        }
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this recommendation from your history?",
      )
    ) {
      return;
    }
    try {
      const response = await aiRecommendationAPI.deleteItem(id);
      if (response.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        if (currentResult && currentResult.id === id) {
          setCurrentResult(null);
        }
        setSuccessMsg("History entry deleted.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your entire search history?",
      )
    ) {
      return;
    }
    try {
      const response = await aiRecommendationAPI.clearHistory();
      if (response.success) {
        setHistory([]);
        setSuccessMsg("Recommendation history cleared.");
      }
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const viewHistoryDetail = async (id) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await aiRecommendationAPI.getDetails(id);
      if (response.success) {
        setCurrentResult(response.data);
        setActiveTab("generate"); // Swaps view back to current result presentation
      }
    } catch (err) {
      setErrorMsg("Failed to retrieve recommendation details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // BOOK NOW WORKFLOW HANDLERS
  const handleOpenBookingModal = (train) => {
    // Extract search query details from currentResult.parameters or form state
    const params = currentResult?.parameters || {};
    const trainSource = train.source || params.source || formData.source || "";
    const trainDest =
      train.destination || params.destination || formData.destination || "";
    const tripDate =
      params.travelDate ||
      formData.travelDate ||
      new Date().toISOString().split("T")[0];
    const tripClass = params.travelClass || formData.travelClass || "ALL";
    const passCount = params.passengers || formData.passengers || 1;
    const seatPref =
      train.seatRecommendation?.preferredBerth ||
      params.preferences?.seatPreference ||
      formData.preferences?.seatPreference ||
      "No Preference";
    const coachPref = train.coachRecommendation?.coach || "Any";

    setBookingTrainDetails({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      source: trainSource,
      destination: trainDest,
      travelDate: tripDate,
      travelClass: tripClass,
      passengers: passCount,
      seatPreference: seatPref,
      coachPreference: coachPref,
      price: train.price,
    });
    setSelectedQuota("GN");
    setSelectedProviderId("irctc");
    setBookingSuccessMsg("");
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    if (bookingProcessing) return;
    setShowBookingModal(false);
    setBookingTrainDetails(null);
  };

  // Helper for client-side deep-link fallback
  const fallbackGenerateUrl = (providerId, params) => {
    const extractCode = (str) => {
      if (!str) return "";
      const m = str.match(/\(([A-Z0-9]+)\)/i);
      return m ? m[1].toUpperCase() : str.trim().split(/\s+/)[0].toUpperCase();
    };
    const src = extractCode(params.source);
    const dst = extractCode(params.destination);
    const date = params.travelDate || new Date().toISOString().split("T")[0];

    switch (providerId) {
      case "irctc":
        return `https://www.irctc.co.in/nget/booking/train-list?src=${encodeURIComponent(src)}&dst=${encodeURIComponent(dst)}&dt=${encodeURIComponent(date)}&cls=${encodeURIComponent(params.travelClass || "ALL")}&quota=${encodeURIComponent(params.quota || "GN")}`;
      case "paytm":
        return `https://paytm.com/train-tickets/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(params.travelClass || "ALL")}`;
      case "confirmtkt":
        return `https://www.confirmtkt.com/rlys/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&quota=${encodeURIComponent(params.quota || "GN")}&trainNo=${encodeURIComponent(params.trainNumber || "")}`;
      case "railyatri":
        return `https://www.railyatri.in/booking/trains-between-stations?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}`;
      case "ixigo":
        return `https://www.ixigo.com/trains/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(params.travelClass || "ALL")}`;
      case "amazonpay":
        return `https://www.amazon.in/travel/trains/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(params.travelClass || "ALL")}`;
      default:
        return `https://www.irctc.co.in/nget/booking/train-list`;
    }
  };

  const handleConfirmRedirect = async () => {
    if (!bookingTrainDetails || !selectedProviderId) return;

    setBookingProcessing(true);
    setBookingSuccessMsg("");

    const payload = {
      trainNumber: bookingTrainDetails.trainNumber,
      trainName: bookingTrainDetails.trainName,
      source: bookingTrainDetails.source,
      destination: bookingTrainDetails.destination,
      travelDate: bookingTrainDetails.travelDate,
      travelClass: bookingTrainDetails.travelClass,
      passengers: bookingTrainDetails.passengers,
      quota: selectedQuota,
      seatPreference: bookingTrainDetails.seatPreference,
      coachPreference: bookingTrainDetails.coachPreference,
      providerId: selectedProviderId,
    };

    let targetUrl = "";

    try {
      const response = await aiRecommendationAPI.prepareBooking(payload);
      if (response.success && response.data?.redirectUrl) {
        targetUrl = response.data.redirectUrl;
      } else {
        targetUrl = fallbackGenerateUrl(selectedProviderId, payload);
      }
    } catch (err) {
      console.warn(
        "Backend prepareBooking endpoint unavailable, proceeding with partner link:",
        err,
      );
      targetUrl = fallbackGenerateUrl(selectedProviderId, payload);
    } finally {
      const selectedPartner = providersList.find(
        (p) => p.id === selectedProviderId,
      );
      const partnerName = selectedPartner?.name || "Official Partner";

      setBookingSuccessMsg(`Redirecting to ${partnerName}...`);

      setTimeout(() => {
        if (targetUrl) {
          window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
        setBookingProcessing(false);
        setShowBookingModal(false);
        setBookingTrainDetails(null);
      }, 700);
    }
  };

  // Filter and sort logic for history
  const filteredHistory = history
    .filter((item) => {
      const sourceMatches = item.parameters?.source
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const destMatches = item.parameters?.destination
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSearch = sourceMatches || destMatches;
      const matchesBookmark = filterBookmark ? item.isBookmarked : true;
      return matchesSearch && matchesBookmark;
    })
    .sort((a, b) => {
      if (sortBy === "score") {
        const scoreA = a.recommendations?.[0]?.recommendationScore || 0;
        const scoreB = b.recommendations?.[0]?.recommendationScore || 0;
        return scoreB - scoreA;
      } else {
        // Sort by Date (default)
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="ai-page">
      <div className="page-header">
        <h1>
          <i className="fa-solid fa-robot header-ai-icon"></i> AI Recommendation
          Engine
        </h1>
        <p>
          Next-generation personalized train booking intelligence. Calculate
          comfort scores, analyze seat selections, forecast coach crowding
          levels, and check travel delay risks instantly.
        </p>
      </div>

      {/* Alert Notices */}
      {errorMsg && (
        <div className={`alert-message ${isFallbackNotice ? "fallback-alert" : "error-alert"}`}>
          <i className={`fa-solid ${isFallbackNotice ? "fa-robot" : "fa-triangle-exclamation"}`}></i> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="alert-message success-alert">
          <i className="fa-solid fa-circle-check"></i> {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === "generate" ? "active" : ""}`}
          onClick={() => setActiveTab("generate")}
        >
          <i className="fa-solid fa-magnifying-glass-chart"></i> Travel Advisor
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("history");
            fetchHistory();
          }}
        >
          <i className="fa-solid fa-clock-rotate-left"></i> Travel Logs &
          Bookmarks
        </button>
      </div>

      {activeTab === "generate" ? (
        <div className="advisor-grid">
          {/* Input Form Column */}
          <div className="form-card card-shadow">
            <h2>
              <i className="fa-solid fa-sliders"></i> Journey Criteria
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="source">Source Station *</label>
                  <div className="input-icon-wrap">
                    <i className="fa-solid fa-location-crosshairs input-icon"></i>
                    <input
                      type="text"
                      id="source"
                      name="source"
                      placeholder="e.g., Mumbai Central (MMCT)"
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="destination">Destination Station *</label>
                  <div className="input-icon-wrap">
                    <i className="fa-solid fa-location-dot input-icon"></i>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      placeholder="e.g., New Delhi (NDLS)"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="travelDate">Travel Date *</label>
                  <input
                    type="date"
                    id="travelDate"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="travelClass">Preferred Class</label>
                  <select
                    id="travelClass"
                    name="travelClass"
                    value={formData.travelClass}
                    onChange={handleInputChange}
                  >
                    <option value="ALL">All Classes (ALL)</option>
                    <option value="1A">AC First Class (1A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="CC">AC Chair Car (CC)</option>
                    <option value="SL">Sleeper Class (SL)</option>
                  </select>
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="passengers">Number of Passengers</label>
                  <input
                    type="number"
                    id="passengers"
                    name="passengers"
                    min="1"
                    max="10"
                    value={formData.passengers}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="budget">Max Budget (INR)</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    placeholder="Optional (e.g., 3000)"
                    min="0"
                    value={formData.budget}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="preferences-section">
                <h3>Preferences</h3>
                <div className="pref-row">
                  <div className="input-group">
                    <label>Seat Allocation</label>
                    <select
                      value={formData.preferences.seatPreference}
                      onChange={(e) =>
                        handlePreferenceChange("seatPreference", e.target.value)
                      }
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Window">Window Seat</option>
                      <option value="Aisle">Aisle Seat</option>
                      <option value="Lower">Lower Berth</option>
                      <option value="Middle">Middle Berth</option>
                      <option value="Upper">Upper Berth</option>
                      <option value="Side Lower">Side Lower</option>
                      <option value="Side Upper">Side Upper</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Class Priority</label>
                    <select
                      value={formData.preferences.classPreference}
                      onChange={(e) =>
                        handlePreferenceChange(
                          "classPreference",
                          e.target.value,
                        )
                      }
                    >
                      <option value="No Preference">No Preference</option>
                      <option value="Luxury">Luxury (First AC)</option>
                      <option value="Premium AC">Premium (AC 2T/3T)</option>
                      <option value="Budget AC">Budget AC (CC/3E)</option>
                      <option value="Economy">Economy (Sleeper)</option>
                    </select>
                  </div>
                </div>

                <label className="checkbox-section-title">
                  Select Travel Priorities
                </label>
                <div className="checkbox-grid">
                  <label
                    className={`checkbox-card ${formData.preferences.fastest ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.fastest}
                      onChange={() => handleCheckboxChange("fastest")}
                    />
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>Fastest Route</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.cheapest ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.cheapest}
                      onChange={() => handleCheckboxChange("cheapest")}
                    />
                    <i className="fa-solid fa-tags"></i>
                    <span>Cheapest Fare</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.leastCrowded ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.leastCrowded}
                      onChange={() => handleCheckboxChange("leastCrowded")}
                    />
                    <i className="fa-solid fa-users-slash"></i>
                    <span>Least Crowded</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.familyFriendly ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.familyFriendly}
                      onChange={() => handleCheckboxChange("familyFriendly")}
                    />
                    <i className="fa-solid fa-people-roof"></i>
                    <span>Family Friendly</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.studentFriendly ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.studentFriendly}
                      onChange={() => handleCheckboxChange("studentFriendly")}
                    />
                    <i className="fa-solid fa-graduation-cap"></i>
                    <span>Student Friendly</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.seniorFriendly ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.seniorFriendly}
                      onChange={() => handleCheckboxChange("seniorFriendly")}
                    />
                    <i className="fa-solid fa-person-cane"></i>
                    <span>Senior Friendly</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.womenFriendly ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.womenFriendly}
                      onChange={() => handleCheckboxChange("womenFriendly")}
                    />
                    <i className="fa-solid fa-person-dress"></i>
                    <span>Women Friendly</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.overnightTravel ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.overnightTravel}
                      onChange={() => handleCheckboxChange("overnightTravel")}
                    />
                    <i className="fa-solid fa-moon"></i>
                    <span>Overnight Travel</span>
                  </label>

                  <label
                    className={`checkbox-card ${formData.preferences.dayTravel ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences.dayTravel}
                      onChange={() => handleCheckboxChange("dayTravel")}
                    />
                    <i className="fa-solid fa-sun"></i>
                    <span>Day Journey</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Analyzing
                    Routes...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Generate
                    AI Advisor Report
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output Column */}
          <div className="results-container">
            {loading && (
              <div className="skeleton-container card-shadow">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-block"></div>
                <div className="skeleton-card-grid">
                  <div className="skeleton-mini-card"></div>
                  <div className="skeleton-mini-card"></div>
                  <div className="skeleton-mini-card"></div>
                </div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
              </div>
            )}

            {!loading && !currentResult && (
              <div className="empty-state card-shadow">
                <i className="fa-solid fa-clipboard-question empty-icon"></i>
                <h3>No Active Advisor Report</h3>
                <p>
                  Enter your source, destination, dates and custom priorities in
                  the Journey Criteria form, and submit to get recommendations
                  instantly.
                </p>
              </div>
            )}

            {!loading && currentResult && (
              <div className="advisor-report-wrapper">
                {currentResult.recommendations &&
                  currentResult.recommendations.map((train, idx) => (
                    <div key={idx} className="advisor-report-card card-shadow">
                      {/* Header Details */}
                      <div className="report-header">
                        <div>
                          <span className="badge category-badge">
                            {train.category} Option
                          </span>
                          <h2>
                            {train.trainName} ({train.trainNumber})
                          </h2>
                          <div className="route-timeline">
                            <span>{train.source}</span>
                            <i className="fa-solid fa-arrow-right"></i>
                            <span>{train.destination}</span>
                          </div>
                        </div>
                        <div className="header-action-group">
                          <button
                            className="book-now-header-btn"
                            onClick={() => handleOpenBookingModal(train)}
                            title="Instant Book with AI Auto-fill"
                          >
                            <i className="fa-solid fa-bolt icon-sparkle"></i>
                            <span>BOOK NOW</span>
                          </button>
                          <button
                            className={`bookmark-btn ${currentResult.isBookmarked ? "bookmarked" : ""}`}
                            onClick={() => handleBookmark(currentResult.id)}
                            title="Bookmark recommendation"
                          >
                            <i
                              className={`fa-${currentResult.isBookmarked ? "solid" : "regular"} fa-bookmark`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Scores row */}
                      <div className="metrics-grid">
                        <div className="metric-box">
                          <div className="metric-score-circle">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                              <path
                                className="circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="circle"
                                strokeDasharray={`${train.recommendationScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <text x="18" y="20.35" className="percentage">
                                {train.recommendationScore}
                              </text>
                            </svg>
                          </div>
                          <span className="metric-label">Match Score</span>
                        </div>

                        <div className="metric-box">
                          <div className="metric-score-bar">
                            <div className="progress-bar-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${train.comfortScore}%` }}
                              ></div>
                            </div>
                            <span className="score-text">
                              {train.comfortScore}%
                            </span>
                          </div>
                          <span className="metric-label">Comfort Score</span>
                        </div>

                        <div className="metric-box font-metric">
                          <span className="metric-value">
                            {train.confidencePercentage}%
                          </span>
                          <span className="metric-label">AI Confidence</span>
                        </div>

                        <div className="metric-box font-metric">
                          <span className="metric-value text-green">
                            ₹{train.price}
                          </span>
                          <span className="metric-label">Est. Price</span>
                        </div>
                      </div>

                      {/* Main parameters block */}
                      <div className="details-accordion">
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-hourglass-half"></i>{" "}
                            Schedule Details
                          </h4>
                          <div className="schedule-details">
                            <div>
                              <strong>Departure:</strong> {train.departureTime}
                            </div>
                            <div>
                              <strong>Arrival:</strong> {train.arrivalTime}
                            </div>
                            <div>
                              <strong>Duration:</strong> {train.duration}
                            </div>
                          </div>
                        </div>

                        {/* Crowd Intelligence */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-users-viewfinder"></i>{" "}
                            Crowd Intelligence
                          </h4>
                          <div className="crowd-details-grid">
                            <div>
                              <strong>Crowd Density:</strong>{" "}
                              <span
                                className={`badge crowd-${train.crowdPrediction?.expectedCrowd?.toLowerCase()?.replace(" ", "-")}`}
                              >
                                {train.crowdPrediction?.expectedCrowd}
                              </span>
                            </div>
                            <div>
                              <strong>Least Crowded Coach:</strong>{" "}
                              <span className="coach-highlight">
                                {train.crowdPrediction?.leastCrowdedCoach}
                              </span>
                            </div>
                          </div>
                          <p className="description-text">
                            {train.crowdPrediction?.rushFactor}
                          </p>
                          <small className="sub-text">
                            {train.crowdPrediction?.peakHoursNote}
                          </small>
                        </div>

                        {/* Seat recommendation */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-chair"></i> Berth
                            Allocation Suggestions
                          </h4>
                          <div className="berth-reco">
                            <div className="berth-badge">
                              <strong>Berth:</strong>{" "}
                              {train.seatRecommendation?.preferredBerth}
                            </div>
                            <p className="description-text">
                              {train.seatRecommendation?.reason}
                            </p>
                            <div className="berth-ratings">
                              <span>
                                Safety:{" "}
                                {Array.from({
                                  length:
                                    train.seatRecommendation?.safetyRating || 5,
                                }).map((_, i) => (
                                  <i
                                    key={i}
                                    className="fa-solid fa-star text-gold"
                                  ></i>
                                ))}
                              </span>
                              <span>
                                Comfort:{" "}
                                {Array.from({
                                  length:
                                    train.seatRecommendation?.comfortRating ||
                                    5,
                                }).map((_, i) => (
                                  <i
                                    key={i}
                                    className="fa-solid fa-star text-gold"
                                  ></i>
                                ))}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Smart Coach Allocation */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-train-subway"></i> Coach
                            Positioning Recommendations
                          </h4>
                          <div className="coach-reco">
                            <div className="coach-header-row">
                              <span>
                                <strong>Coach:</strong>{" "}
                                {train.coachRecommendation?.coach}
                              </span>
                              <span>
                                <strong>Safety:</strong>{" "}
                                {train.coachRecommendation?.safetyScore}%
                              </span>
                            </div>
                            <p className="description-text">
                              {train.coachRecommendation?.reason}
                            </p>
                            <div className="coach-features">
                              <span
                                className={`feature-pill ${train.coachRecommendation?.nearExit ? "yes" : "no"}`}
                              >
                                <i className="fa-solid fa-door-open"></i> Near
                                Exit
                              </span>
                              <span
                                className={`feature-pill ${train.coachRecommendation?.nearWashroom ? "yes" : "no"}`}
                              >
                                <i className="fa-solid fa-restroom"></i> Near
                                Washroom
                              </span>
                              <span className="feature-pill distance-pill">
                                <i className="fa-solid fa-walking"></i>{" "}
                                {train.coachRecommendation?.walkingDistance}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Delay prediction */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-clock"></i> Delay
                            Prediction & Reliability
                          </h4>
                          <div className="delay-info">
                            <div>
                              <strong>Delay Probability:</strong>{" "}
                              <span
                                className={`badge delay-${train.delayPrediction?.probability?.toLowerCase()}`}
                              >
                                {train.delayPrediction?.probability}
                              </span>
                            </div>
                            {train.delayPrediction?.estimatedDelayMinutes >
                              0 && (
                              <div>
                                <strong>Est. Delay:</strong>{" "}
                                {train.delayPrediction?.estimatedDelayMinutes}{" "}
                                mins
                              </div>
                            )}
                          </div>
                          <p className="description-text">
                            {train.delayPrediction?.reasoning}
                          </p>
                        </div>

                        {/* Advanced Safety scores */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-shield-halved"></i> Safety
                            & Demographics Scores
                          </h4>
                          <div className="safety-grid">
                            <div className="safety-score-pill">
                              <span>Women Safety:</span>
                              <strong>
                                {train.advancedMetrics?.womenSafetyScore}/100
                              </strong>
                            </div>
                            <div className="safety-score-pill">
                              <span>Night Safety:</span>
                              <strong>
                                {train.advancedMetrics?.nightSafetyScore}/100
                              </strong>
                            </div>
                            <div className="safety-score-pill">
                              <span>Family Score:</span>
                              <strong>
                                {train.advancedMetrics?.familyScore}/100
                              </strong>
                            </div>
                          </div>
                          <div className="impacts-info">
                            <div>
                              <strong>Weather Impact:</strong>{" "}
                              {train.advancedMetrics?.weatherImpact}
                            </div>
                            <div>
                              <strong>Festival Impact:</strong>{" "}
                              {train.advancedMetrics?.festivalImpact}
                            </div>
                          </div>
                          <div className="wl-advice font-metric text-blue card-shadow-inset">
                            <h5>Seat Allocation Probability</h5>
                            <div>
                              Availability:{" "}
                              {
                                train.advancedMetrics
                                  ?.seatAvailabilityProbability
                              }
                              % | Confirmation:{" "}
                              {train.advancedMetrics?.confirmationChance}
                            </div>
                            <p className="sub-text">
                              {train.advancedMetrics?.waitingListAdvice}
                            </p>
                          </div>
                        </div>

                        {/* Why choose this train */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-regular fa-comment-dots"></i>{" "}
                            Explanation & Evaluation
                          </h4>
                          <p className="explanation-paragraph">
                            {train.reasonsToChoose}
                          </p>
                          <div className="pros-cons-grid">
                            <div className="pro-box">
                              <h5>Advantages</h5>
                              <ul>
                                {train.advantages?.map((adv, aIdx) => (
                                  <li key={aIdx}>
                                    <i className="fa-solid fa-check text-green"></i>{" "}
                                    {adv}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="con-box">
                              <h5>Disadvantages</h5>
                              <ul>
                                {train.disadvantages?.map((dis, dIdx) => (
                                  <li key={dIdx}>
                                    <i className="fa-solid fa-xmark text-red"></i>{" "}
                                    {dis}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Travel tips */}
                        <div className="accordion-item">
                          <h4>
                            <i className="fa-solid fa-lightbulb"></i> Travel &
                            Station Advice
                          </h4>
                          <ul className="bullet-tips">
                            {train.travelTips?.map((tip, tIdx) => (
                              <li key={tIdx}>
                                <i className="fa-solid fa-circle-info text-blue"></i>{" "}
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Prominent BOOK NOW Card Action Banner */}
                      <div className="booking-card-action-bar">
                        <div className="booking-action-info">
                          <div className="action-badge-pulse">
                            <i className="fa-solid fa-circle-check"></i>{" "}
                            Recommended Choice
                          </div>
                          <p>
                            Auto-fill Train #{train.trainNumber}, seats, class,
                            and journey date across 6+ booking partners.
                          </p>
                        </div>
                        <button
                          className="book-now-card-btn"
                          onClick={() => handleOpenBookingModal(train)}
                        >
                          <i className="fa-solid fa-ticket"></i>
                          <span>BOOK NOW</span>
                          <i className="fa-solid fa-arrow-right arrow-shift"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Alternatives comparison */}
                {currentResult.alternatives &&
                  currentResult.alternatives.length > 0 && (
                    <div className="comparison-card card-shadow">
                      <h3>
                        <i className="fa-solid fa-right-left"></i> Alternative
                        Train Options
                      </h3>
                      <div className="alternatives-grid">
                        {currentResult.alternatives.map((alt, aIdx) => (
                          <div key={aIdx} className="alternative-item">
                            <div className="alt-title-row">
                              <h4>
                                {alt.trainName} ({alt.trainNumber})
                              </h4>
                              <span className="price-tag">₹{alt.price}</span>
                            </div>
                            <p className="alt-route">
                              {alt.source} → {alt.destination} |{" "}
                              {alt.departureTime} ({alt.duration})
                            </p>
                            <div className="comparison-reason">
                              <i className="fa-regular fa-hand-point-right"></i>{" "}
                              {alt.comparisonReason}
                            </div>
                            <div className="alt-booking-row">
                              <button
                                className="alt-book-btn"
                                onClick={() => handleOpenBookingModal(alt)}
                              >
                                <i className="fa-solid fa-bolt"></i> BOOK NOW
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Journey Insights */}
                {currentResult.journeyInsights && (
                  <div className="insights-card card-shadow">
                    <h3>
                      <i className="fa-solid fa-wand-magic-sparkles"></i> AI
                      Journey Insights
                    </h3>
                    <div className="insights-container">
                      <div className="weather-banner card-shadow-inset">
                        <i className="fa-solid fa-cloud-sun weather-icon"></i>
                        <div>
                          <h5>Destination Weather & Packing</h5>
                          <p>{currentResult.journeyInsights.weatherReminder}</p>
                        </div>
                      </div>

                      <div className="packing-safety-split">
                        <div>
                          <h5>Packing Checklist</h5>
                          <ul className="bullet-tips">
                            {currentResult.journeyInsights.packingTips?.map(
                              (pt, pIdx) => (
                                <li key={pIdx}>
                                  <i className="fa-solid fa-suitcase"></i> {pt}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                        <div>
                          <h5>Security Advisories</h5>
                          <ul className="bullet-tips">
                            {currentResult.journeyInsights.safetyTips?.map(
                              (st, sIdx) => (
                                <li key={sIdx}>
                                  <i className="fa-solid fa-lock text-green"></i>{" "}
                                  {st}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="info-blocks-row">
                        <div>
                          <h5>Station Boarding Advice</h5>
                          <p className="description-text">
                            {currentResult.journeyInsights.platformSuggestions}
                          </p>
                        </div>
                        <div>
                          <h5>E-Catering & Foods</h5>
                          <p className="description-text">
                            {currentResult.journeyInsights.foodRecommendations}
                          </p>
                        </div>
                      </div>

                      <div className="journey-checklist-box">
                        <h5>Travel Document Checklist</h5>
                        <div className="checklist-items">
                          {currentResult.journeyInsights.journeyChecklist?.map(
                            (item, cIdx) => (
                              <label
                                key={cIdx}
                                className="checklist-item-check"
                              >
                                <input type="checkbox" />
                                <span>{item}</span>
                              </label>
                            ),
                          )}
                        </div>
                      </div>

                      {currentResult.journeyInsights.emergencySuggestions && (
                        <div className="emergency-banner">
                          <i className="fa-solid fa-kit-medical emergency-icon"></i>
                          <div>
                            <h5>In-Transit Emergency Plan</h5>
                            <p>
                              {
                                currentResult.journeyInsights
                                  .emergencySuggestions
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History & Bookmarks tab */
        <div className="history-section card-shadow">
          <div className="history-header">
            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i> Your Travel
              Search Logs
            </h2>
            {history.length > 0 && (
              <button
                className="clear-history-btn"
                onClick={handleClearHistory}
              >
                <i className="fa-solid fa-trash-can"></i> Clear All History
              </button>
            )}
          </div>

          <div className="filters-row">
            <div className="search-wrap">
              <i className="fa-solid fa-magnifying-glass search-bar-icon"></i>
              <input
                type="text"
                placeholder="Search history by station name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters-btn-group">
              <button
                className={`filter-toggle-btn ${filterBookmark ? "active" : ""}`}
                onClick={() => setFilterBookmark(!filterBookmark)}
              >
                <i className="fa-solid fa-bookmark"></i> Bookmarked Only
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="date">Sort by Search Date</option>
                <option value="score">Sort by AI Score</option>
              </select>
            </div>
          </div>

          {loadingHistory ? (
            <div className="loading-spinner-wrap">
              <i className="fa-solid fa-spinner fa-spin spinner-icon"></i>
              <p>Fetching history logs...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-state borderless">
              <i className="fa-solid fa-box-open empty-icon"></i>
              <h3>No Travel Logs Found</h3>
              <p>
                {searchQuery || filterBookmark
                  ? "Try resetting your search query or filters to discover previous travel advisor logs."
                  : "You haven't generated any AI recommendations yet. Submit your first journey request above!"}
              </p>
            </div>
          ) : (
            <div className="history-list">
              {filteredHistory.map((item) => {
                const mainTrain = item.recommendations?.[0];
                return (
                  <div key={item.id} className="history-item-row">
                    <div
                      className="history-item-details"
                      onClick={() => viewHistoryDetail(item.id)}
                    >
                      <div className="item-title">
                        <strong>
                          {item.parameters?.source} →{" "}
                          {item.parameters?.destination}
                        </strong>
                        <span className="history-date">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="item-train-info">
                        {mainTrain ? (
                          <>
                            <span>
                              <i className="fa-solid fa-train"></i>{" "}
                              {mainTrain.trainName} ({mainTrain.trainNumber})
                            </span>
                            <span className="item-train-comfort">
                              Score: {mainTrain.recommendationScore}% | Class:{" "}
                              {item.parameters?.travelClass}
                            </span>
                          </>
                        ) : (
                          <span>Recommendation Details Available</span>
                        )}
                      </div>
                    </div>
                    <div className="history-actions">
                      {mainTrain && (
                        <button
                          className="history-book-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBookingModal({
                              ...mainTrain,
                              source: item.parameters?.source,
                              destination: item.parameters?.destination,
                            });
                          }}
                          title="Instant Book this Train"
                        >
                          <i className="fa-solid fa-ticket"></i> BOOK
                        </button>
                      )}
                      <button
                        className={`bookmark-btn ${item.isBookmarked ? "bookmarked" : ""}`}
                        onClick={() => handleBookmark(item.id)}
                        title={
                          item.isBookmarked
                            ? "Remove Bookmark"
                            : "Bookmark Recommendation"
                        }
                      >
                        <i
                          className={`fa-${item.isBookmarked ? "solid" : "regular"} fa-bookmark`}
                        ></i>
                      </button>
                      <button
                        className="delete-history-item-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Delete from history"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* BOOKING PARTNERS MODAL */}
      {showBookingModal && bookingTrainDetails && (
        <div className="booking-modal-overlay" onClick={closeBookingModal}>
          <div
            className="booking-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="booking-modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <i className="fa-solid fa-train-subway"></i>
                </div>
                <div>
                  <h3>Choose Booking Partner</h3>
                  <p className="modal-subtitle">
                    Auto-prepared journey payload will be pre-filled on your
                    chosen platform.
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={closeBookingModal}
                title="Close Modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Auto-filled Details Summary */}
            <div className="booking-summary-banner">
              <div className="summary-train-info">
                <div className="train-badge-pill">
                  <i className="fa-solid fa-ticket"></i>{" "}
                  {bookingTrainDetails.trainNumber} -{" "}
                  {bookingTrainDetails.trainName}
                </div>
                <div className="train-route-pill">
                  <span>{bookingTrainDetails.source}</span>
                  <i className="fa-solid fa-arrow-right-long"></i>
                  <span>{bookingTrainDetails.destination}</span>
                </div>
              </div>

              <div className="summary-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Journey Date</span>
                  <span className="meta-val">
                    {bookingTrainDetails.travelDate || "As Selected"}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Class</span>
                  <span className="meta-val">
                    {bookingTrainDetails.travelClass || "ALL"}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Passengers</span>
                  <span className="meta-val">
                    {bookingTrainDetails.passengers || 1} Person(s)
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Booking Quota</span>
                  <select
                    value={selectedQuota}
                    onChange={(e) => setSelectedQuota(e.target.value)}
                    className="quota-select-inline"
                  >
                    <option value="GN">GN - General Quota</option>
                    <option value="TQ">TQ - Tatkal Quota</option>
                    <option value="PT">PT - Premium Tatkal</option>
                    <option value="SS">SS - Senior Citizen</option>
                    <option value="LD">LD - Ladies Quota</option>
                  </select>
                </div>
                {bookingTrainDetails.seatPreference && (
                  <div className="meta-item">
                    <span className="meta-label">Berth Recommendation</span>
                    <span className="meta-val highlight">
                      {bookingTrainDetails.seatPreference}
                    </span>
                  </div>
                )}
                {bookingTrainDetails.coachPreference && (
                  <div className="meta-item">
                    <span className="meta-label">Coach Suggestion</span>
                    <span className="meta-val highlight">
                      {bookingTrainDetails.coachPreference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Partner Selection Cards Grid */}
            <div className="providers-selection-grid">
              {providersList.map((provider) => {
                const isSelected = selectedProviderId === provider.id;
                return (
                  <div
                    key={provider.id}
                    className={`provider-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedProviderId(provider.id)}
                  >
                    <div className="provider-card-header">
                      <div
                        className="provider-logo-wrap"
                        style={{
                          borderColor: provider.brandColor || "#1a56db",
                        }}
                      >
                        <ProviderIcon type={provider.logoType || provider.id} />
                      </div>
                      <div className="provider-title-wrap">
                        <h4>{provider.name}</h4>
                        <span className="provider-tagline">
                          {provider.tagline}
                        </span>
                      </div>
                      <div className="radio-indicator">
                        <div
                          className={`custom-radio ${isSelected ? "checked" : ""}`}
                        >
                          {isSelected && <div className="radio-inner" />}
                        </div>
                      </div>
                    </div>

                    <div className="provider-badge-row">
                      <span
                        className="provider-badge"
                        style={{
                          backgroundColor: provider.badgeColor || "#1a56db",
                        }}
                      >
                        {provider.badge}
                      </span>
                      {provider.features &&
                        provider.features.slice(0, 2).map((feat, fIdx) => (
                          <span key={fIdx} className="feature-pill-mini">
                            <i className="fa-solid fa-check"></i> {feat}
                          </span>
                        ))}
                    </div>

                    <p className="provider-desc">{provider.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Notification / Redirecting feedback */}
            {bookingSuccessMsg && (
              <div className="booking-feedback-alert">
                <i className="fa-solid fa-circle-check text-green"></i>
                <span>{bookingSuccessMsg}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="booking-modal-footer">
              <button
                className="modal-cancel-btn"
                onClick={closeBookingModal}
                disabled={bookingProcessing}
              >
                Cancel
              </button>
              <button
                className={`modal-confirm-btn ${bookingProcessing ? "loading" : ""}`}
                disabled={bookingProcessing || !selectedProviderId}
                onClick={handleConfirmRedirect}
              >
                {bookingProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Preparing
                    Direct Redirect...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>{" "}
                    Continue to{" "}
                    {providersList.find((p) => p.id === selectedProviderId)
                      ?.name || "Partner"}{" "}
                    Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiRecommendation;
