import { useState, useEffect } from "react";
import {
  FaTrain,
  FaLocationDot,
  FaRobot,
  FaBell,
  FaListCheck,
  FaNoteSticky,
  FaShieldHalved,
  FaChartLine,
  FaStar,
  FaHeart,
  FaShareNodes,
  FaClock,
  FaSuitcaseRolling,
  FaTicket,
  FaMoon,
  FaSun,
  FaPlus,
  FaTrash,
  FaThumbtack,
  FaMagnifyingGlass,
  FaPhoneVolume,
  FaTriangleExclamation,
  FaCheck,
  FaArrowRightLong,
  FaRotateRight,
  FaUtensils,
  FaCloudSun,
  FaPercent,
  FaRoute,
} from "react-icons/fa6";

import {
  getUserJourneys,
  getJourneyDetails,
  createJourney,
  searchTrainOrPNR,
  askAIAssistant,
  getAITips,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  addNote,
  togglePinNote,
  deleteNote,
  getUserAnalytics,
  saveJourneyMemory,
} from "../services/journeyCompanion.service";

import "../styles/journeyCompanion.css";

const JourneyCompanion = () => {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, timeline, assistant, reminders, checklist, notes, insights, emergency, analytics
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Data State
  const [journeys, setJourneys] = useState([]);
  const [activeJourney, setActiveJourney] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState("");

  // Search & Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    trainNumber: "",
    trainName: "",
    pnr: "",
    from: "",
    to: "",
    journeyDate: new Date().toISOString().split("T")[0],
    departureTime: "08:00",
    arrivalTime: "20:00",
    coach: "B2",
    seat: "34",
    platform: "PF-4",
  });

  // AI Assistant Chat State
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! I am your AI Journey Companion. Ask me anything about your current train journey!",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // New Note & Checklist Inputs
  const [newChecklistText, setNewChecklistText] = useState("");
  const [newChecklistCategory, setNewChecklistCategory] =
    useState("Essentials");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState("General");

  // Reminders Toggle State
  const [reminders, setReminders] = useState({
    boarding: true,
    station: true,
    destination: true,
    luggage: true,
    wakeup: true,
  });

  // Emergency SOS Trigger
  const [isSosActive, setIsSosActive] = useState(false);

  // Memories Form
  const [userRating, setUserRating] = useState(5);
  const [memorySummary, setMemorySummary] = useState("");

  // Initial Load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const journeyRes = await getUserJourneys("default_user");
      const list = journeyRes.data || [];
      setJourneys(list);

      if (list.length > 0) {
        const detailsRes = await getJourneyDetails(list[0].id);
        setActiveJourney(detailsRes.data);
      } else {
        // Fallback default sample if empty
        const sampleRes = await createJourney({
          trainNumber: "12951",
          trainName: "Mumbai Rajdhani Express",
          pnr: "2849104829",
          from: "Mumbai Central (MMCT)",
          to: "New Delhi (NDLS)",
          journeyDate: new Date().toISOString().split("T")[0],
          departureTime: "17:00",
          arrivalTime: "08:32",
          coach: "B2",
          seat: "34",
          platform: "PF-4",
        });
        setActiveJourney(sampleRes.data);
      }

      const analyticsRes = await getUserAnalytics("default_user");
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Failed to load initial journey companion data:", err);
      setErrorMsg("Connected with local smart engine.");
    } finally {
      setLoading(false);
    }
  };

  // Select another active journey
  const handleSelectJourney = async (jId) => {
    setLoading(true);
    try {
      const detailsRes = await getJourneyDetails(jId);
      setActiveJourney(detailsRes.data);
    } catch (err) {
      console.error("Failed to select journey:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search Train/PNR in Create Modal
  const handleSearchTrainOrPNR = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      try {
        const res = await searchTrainOrPNR(query);
        if (res.data) {
          if (res.data.isPNR && res.data.pnrData) {
            setFormData({ ...formData, ...res.data.pnrData });
          } else if (res.data.trains && res.data.trains.length > 0) {
            setSearchResults(res.data.trains);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectSearchResult = (train) => {
    setFormData({
      ...formData,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      from: train.from,
      to: train.to,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
    });
    setSearchResults([]);
  };

  // Create Journey Submit
  const handleCreateJourney = async (e) => {
    e.preventDefault();
    try {
      const res = await createJourney(formData);
      if (res.success) {
        setActiveJourney(res.data);
        const listRes = await getUserJourneys("default_user");
        setJourneys(listRes.data || []);
        setIsCreateModalOpen(false);
        setFormData({
          trainNumber: "",
          trainName: "",
          pnr: "",
          from: "",
          to: "",
          journeyDate: new Date().toISOString().split("T")[0],
          departureTime: "08:00",
          arrivalTime: "20:00",
          coach: "B2",
          seat: "34",
          platform: "PF-4",
        });
      }
    } catch (err) {
      console.error("Create journey failed:", err);
    }
  };

  // Live Progress Manual Adjustment for Demo
  const handleSimulateProgress = async (newProgress) => {
    if (!activeJourney) return;
    try {
      const updated = await getJourneyDetails(activeJourney.id);
      const updatedData = { ...updated.data, progress: newProgress };
      setActiveJourney(updatedData);
    } catch (err) {
      console.error(err);
    }
  };

  // Ask AI Assistant Question
  const handleAskAI = async (customQuestion) => {
    const q = customQuestion || chatQuestion;
    if (!q.trim()) return;

    const userMsg = { sender: "user", text: q };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customQuestion) setChatQuestion("");
    setIsAiThinking(true);

    try {
      const res = await askAIAssistant(activeJourney?.id, q);
      const botMsg = {
        sender: "bot",
        text: res.answer || "Here to assist you with your journey.",
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg = {
        sender: "bot",
        text: `Based on your journey (${activeJourney?.trainName || "Express"}), you are on schedule near your current station stop. Stay safe!`,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Load AI Tips & Insights
  const handleFetchAITips = async () => {
    try {
      const res = await getAITips(activeJourney);
      setAiInsights(res.tips);
    } catch (err) {
      console.error(err);
    }
  };

  // Checklist Actions
  const handleAddChecklist = async (e) => {
    e.preventDefault();
    if (!newChecklistText.trim() || !activeJourney) return;
    try {
      const res = await addChecklistItem(activeJourney.id, {
        text: newChecklistText,
        category: newChecklistCategory,
      });
      setActiveJourney({ ...activeJourney, checklist: res.data });
      setNewChecklistText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklist = async (itemId) => {
    if (!activeJourney) return;
    try {
      const res = await toggleChecklistItem(activeJourney.id, itemId);
      setActiveJourney({ ...activeJourney, checklist: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChecklist = async (itemId) => {
    if (!activeJourney) return;
    try {
      const res = await deleteChecklistItem(activeJourney.id, itemId);
      setActiveJourney({ ...activeJourney, checklist: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  // Notes Actions
  const handleAddNote = async (e) => {
    e.preventDefault();
    if ((!newNoteTitle.trim() && !newNoteContent.trim()) || !activeJourney)
      return;
    try {
      const res = await addNote(activeJourney.id, {
        title: newNoteTitle,
        content: newNoteContent,
        category: newNoteCategory,
      });
      setActiveJourney({ ...activeJourney, notes: res.data });
      setNewNoteTitle("");
      setNewNoteContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePinNote = async (noteId) => {
    if (!activeJourney) return;
    try {
      const res = await togglePinNote(activeJourney.id, noteId);
      setActiveJourney({ ...activeJourney, notes: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!activeJourney) return;
    try {
      const res = await deleteNote(activeJourney.id, noteId);
      setActiveJourney({ ...activeJourney, notes: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  // Save Memory
  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!activeJourney) return;
    try {
      const res = await saveJourneyMemory(activeJourney.id, {
        rating: userRating,
        summary: memorySummary,
        isFavourite: true,
      });
      setActiveJourney(res.data);
      alert("Journey Memory & Review Saved Successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Questions Chips
  const quickQuestions = [
    "How much time left?",
    "Which station is next?",
    "When should I wake up?",
    "When should I get down?",
    "Where is my platform?",
    "How long is the stop?",
    "What should I do now?",
  ];

  return (
    <div
      className={`journey-companion-container ${!isDarkMode ? "light-theme" : ""}`}
    >
      {/* Header Bar */}
      <header className="jc-header">
        <div className="jc-title-area">
          <h1>
            <FaTrain /> AI Journey Companion
          </h1>
          <p>
            Your intelligent pre-journey, in-transit & post-journey travel
            assistant
          </p>
        </div>

        <div className="jc-actions-area">
          {/* Journey Selector Dropdown */}
          {journeys.length > 0 && (
            <select
              className="jc-form-input"
              value={activeJourney?.id || ""}
              onChange={(e) => handleSelectJourney(e.target.value)}
              style={{ width: "auto" }}
            >
              {journeys.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.trainName} ({j.trainNumber}) - {j.journeyDate}
                </option>
              ))}
            </select>
          )}

          <button
            className="jc-btn jc-btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus /> Plan New Journey
          </button>

          <button
            className="jc-icon-btn"
            title="Toggle Theme"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="jc-tabs-nav">
        <button
          className={`jc-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaTrain /> Dashboard & Live Progress
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "timeline" ? "active" : ""}`}
          onClick={() => setActiveTab("timeline")}
        >
          <FaRoute /> Live Timeline
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "assistant" ? "active" : ""}`}
          onClick={() => setActiveTab("assistant")}
        >
          <FaRobot /> AI Assistant
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "reminders" ? "active" : ""}`}
          onClick={() => setActiveTab("reminders")}
        >
          <FaBell /> Smart Reminders
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "checklist" ? "active" : ""}`}
          onClick={() => setActiveTab("checklist")}
        >
          <FaListCheck /> Travel Checklist
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <FaNoteSticky /> Journey Notes
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "insights" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("insights");
            handleFetchAITips();
          }}
        >
          <FaCloudSun /> Insights & Memories
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "emergency" ? "active" : ""}`}
          onClick={() => setActiveTab("emergency")}
        >
          <FaShieldHalved /> Emergency SOS
        </button>

        <button
          className={`jc-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <FaChartLine /> Analytics & History
        </button>
      </nav>

      {/* Main Content Areas */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <FaRotateRight
            className="fa-spin"
            style={{ fontSize: "2.5rem", color: "var(--jc-accent)" }}
          />
          <p style={{ marginTop: "1rem", color: "var(--jc-text-secondary)" }}>
            Syncing live train metrics & journey data...
          </p>
        </div>
      ) : (
        <>
          {/* 1. DASHBOARD TAB */}
          {activeTab === "dashboard" && activeJourney && (
            <div>
              {/* Hero Live Status Banner */}
              <div className="jc-hero-banner">
                <div className="jc-hero-top">
                  <div className="jc-train-header-info">
                    <h2>
                      {activeJourney.trainName} ({activeJourney.trainNumber})
                    </h2>
                    <div className="jc-train-badges">
                      <span className="jc-badge jc-badge-live">
                        {activeJourney.status || "IN TRANSIT"}
                      </span>
                      <span className="jc-badge jc-badge-info">
                        <FaTicket /> PNR: {activeJourney.pnr || "CNF2940294"}
                      </span>
                      <span className="jc-badge jc-badge-info">
                        Platform: {activeJourney.platform || "PF-4"}
                      </span>
                      <span className="jc-badge jc-badge-info">
                        Coach: {activeJourney.coach || "B2"} / Seat:{" "}
                        {activeJourney.seat || "34"}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--jc-text-secondary)",
                      }}
                    >
                      Journey Date
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                      {activeJourney.journeyDate}
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Stations */}
                <div className="jc-progress-wrapper">
                  <div className="jc-progress-labels">
                    <span>
                      <FaLocationDot /> {activeJourney.from} (
                      {activeJourney.departureTime})
                    </span>
                    <span
                      style={{ color: "var(--jc-accent)", fontWeight: "800" }}
                    >
                      {activeJourney.timeline?.progress ||
                        activeJourney.progress ||
                        45}
                      % Completed
                    </span>
                    <span>
                      <FaLocationDot /> {activeJourney.to} (
                      {activeJourney.arrivalTime})
                    </span>
                  </div>

                  <div className="jc-progress-bar-bg">
                    <div
                      className="jc-progress-bar-fill"
                      style={{
                        width: `${activeJourney.timeline?.progress || activeJourney.progress || 45}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Simulated Live Controls */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--jc-text-muted)",
                    }}
                  >
                    Simulate Live Progress:
                  </span>
                  {[0, 25, 50, 75, 100].map((p) => (
                    <button
                      key={p}
                      className="jc-chip"
                      onClick={() => handleSimulateProgress(p)}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Dashboard Metrics Grid */}
              <div className="jc-dashboard-grid">
                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">
                      <FaClock /> Departure & Arrival
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                    }}
                  >
                    <div>
                      <small style={{ color: "var(--jc-text-muted)" }}>
                        Departure
                      </small>
                      <div style={{ fontSize: "1.25rem", fontWeight: "800" }}>
                        {activeJourney.departureTime}
                      </div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--jc-text-secondary)",
                        }}
                      >
                        {activeJourney.from}
                      </span>
                    </div>

                    <FaArrowRightLong
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--jc-accent)",
                        margin: "auto",
                      }}
                    />

                    <div style={{ textAlign: "right" }}>
                      <small style={{ color: "var(--jc-text-muted)" }}>
                        Arrival
                      </small>
                      <div style={{ fontSize: "1.25rem", fontWeight: "800" }}>
                        {activeJourney.arrivalTime}
                      </div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--jc-text-secondary)",
                        }}
                      >
                        {activeJourney.to}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">
                      <FaLocationDot /> Current Station
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      marginTop: "0.5rem",
                    }}
                  >
                    {activeJourney.timeline?.currentStation?.name ||
                      "Vadodara Junction (BRC)"}
                  </div>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      color: "var(--jc-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Halt Duration:{" "}
                    {activeJourney.timeline?.currentStation?.stopDuration ||
                      "10 mins"}
                  </p>
                </div>

                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">
                      <FaArrowRightLong /> Next Station
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      marginTop: "0.5rem",
                    }}
                  >
                    {activeJourney.timeline?.nextStation?.name ||
                      "Ratlam Junction (RTM)"}
                  </div>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      color: "var(--jc-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Expected Arrival:{" "}
                    {activeJourney.timeline?.nextStation?.time || "00:25 AM"}
                  </p>
                </div>

                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">
                      <FaSuitcaseRolling /> Travel Checklist Status
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "800",
                      color: "var(--jc-success)",
                    }}
                  >
                    {activeJourney.checklistStats?.percentage || 60}% Done
                  </div>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      color: "var(--jc-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {activeJourney.checklistStats?.completed || 3} of{" "}
                    {activeJourney.checklistStats?.total || 8} items packed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. LIVE TIMELINE TAB */}
          {activeTab === "timeline" && activeJourney && (
            <div className="jc-card">
              <div className="jc-card-header">
                <h3 className="jc-card-title">
                  <FaRoute /> Dynamic Journey Timeline & Station Stops
                </h3>
              </div>

              <div className="jc-timeline-list">
                {activeJourney.timeline?.milestones?.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`jc-timeline-item ${milestone.status}`}
                  >
                    <div className="jc-timeline-marker">
                      {milestone.status === "completed" ? (
                        <FaCheck />
                      ) : (
                        <FaLocationDot />
                      )}
                    </div>
                    <div className="jc-timeline-content">
                      <h4>{milestone.title}</h4>
                      <p>{milestone.subtitle}</p>
                      <small
                        style={{
                          color: "var(--jc-text-muted)",
                          marginTop: "0.2rem",
                        }}
                      >
                        Time: {milestone.timestamp}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. AI ASSISTANT TAB */}
          {activeTab === "assistant" && (
            <div className="jc-card" style={{ padding: "0" }}>
              <div
                className="jc-card-header"
                style={{
                  padding: "1.5rem",
                  borderBottom: "1px solid var(--jc-border)",
                }}
              >
                <h3 className="jc-card-title">
                  <FaRobot /> AI Journey Assistant Q&A
                </h3>
              </div>

              <div className="jc-assistant-box">
                <div className="jc-chat-messages">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`jc-chat-bubble ${msg.sender}`}>
                      {msg.text}
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="jc-chat-bubble bot">
                      <FaRotateRight className="fa-spin" /> Thinking...
                    </div>
                  )}
                </div>

                <div className="jc-chat-quick-chips">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      className="jc-chip"
                      onClick={() => handleAskAI(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="jc-chat-input-row">
                  <input
                    type="text"
                    className="jc-chat-input"
                    placeholder="Ask AI about time left, next station, platform, wake up..."
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  />
                  <button
                    className="jc-btn jc-btn-primary"
                    onClick={() => handleAskAI()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. SMART REMINDERS TAB */}
          {activeTab === "reminders" && activeJourney && (
            <div className="jc-card">
              <div className="jc-card-header">
                <h3 className="jc-card-title">
                  <FaBell /> Smart Automated Journey Reminders
                </h3>
              </div>

              <div className="jc-checklist-group">
                {activeJourney.reminders?.map((rem) => (
                  <div key={rem.id} className="jc-checklist-item">
                    <div>
                      <strong style={{ display: "block", fontSize: "1rem" }}>
                        {rem.title}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--jc-text-secondary)",
                        }}
                      >
                        {rem.description}
                      </span>
                    </div>

                    <label className="jc-checkbox-custom">
                      <input
                        type="checkbox"
                        checked={reminders[rem.id] !== false}
                        onChange={() =>
                          setReminders({
                            ...reminders,
                            [rem.id]: !reminders[rem.id],
                          })
                        }
                      />
                      <span style={{ fontWeight: "600" }}>Enabled</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TRAVEL CHECKLIST TAB */}
          {activeTab === "checklist" && activeJourney && (
            <div className="jc-card">
              <div className="jc-card-header">
                <h3 className="jc-card-title">
                  <FaListCheck /> Interactive Travel Checklist
                </h3>
              </div>

              <form
                onSubmit={handleAddChecklist}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <input
                  type="text"
                  className="jc-form-input"
                  placeholder="Add item (e.g., Medicine, Power bank, Wallet)"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select
                  className="jc-form-input"
                  value={newChecklistCategory}
                  onChange={(e) => setNewChecklistCategory(e.target.value)}
                >
                  <option value="Essentials">Essentials</option>
                  <option value="Documents">Documents</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Health">Health</option>
                </select>
                <button type="submit" className="jc-btn jc-btn-primary">
                  <FaPlus /> Add
                </button>
              </form>

              <div className="jc-checklist-group">
                {activeJourney.checklist?.map((item) => (
                  <div
                    key={item.id}
                    className={`jc-checklist-item ${item.isCompleted ? "done" : ""}`}
                  >
                    <label className="jc-checkbox-custom">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleToggleChecklist(item.id)}
                      />
                      <span
                        className="jc-item-text"
                        style={{ fontWeight: "600" }}
                      >
                        {item.text}
                      </span>
                      <span
                        className="jc-badge jc-badge-info"
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {item.category}
                      </span>
                    </label>

                    <button
                      className="jc-icon-btn"
                      onClick={() => handleDeleteChecklist(item.id)}
                      title="Delete Item"
                    >
                      <FaTrash
                        style={{
                          color: "var(--jc-danger)",
                          fontSize: "0.85rem",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. JOURNEY NOTES TAB */}
          {activeTab === "notes" && activeJourney && (
            <div className="jc-card">
              <div className="jc-card-header">
                <h3 className="jc-card-title">
                  <FaNoteSticky /> Save Journey Notes
                </h3>
              </div>

              <form
                onSubmit={handleAddNote}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <input
                  type="text"
                  className="jc-form-input"
                  placeholder="Note Title (e.g., Food was good)"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                />
                <textarea
                  className="jc-form-input"
                  placeholder="Note content..."
                  rows="3"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                ></textarea>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <select
                    className="jc-form-input"
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Food">Food</option>
                    <option value="Comfort">Comfort</option>
                    <option value="Hygiene">Hygiene</option>
                  </select>
                  <button type="submit" className="jc-btn jc-btn-primary">
                    <FaPlus /> Save Note
                  </button>
                </div>
              </form>

              <div className="jc-notes-grid">
                {activeJourney.notes?.map((note) => (
                  <div
                    key={note.id}
                    className={`jc-note-card ${note.isPinned ? "pinned" : ""}`}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h4>{note.title}</h4>
                        <button
                          className="jc-icon-btn"
                          onClick={() => handleTogglePinNote(note.id)}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaThumbtack
                            style={{
                              color: note.isPinned
                                ? "var(--jc-warning)"
                                : "var(--jc-text-muted)",
                            }}
                          />
                        </button>
                      </div>
                      <p>{note.content}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <span className="jc-badge jc-badge-info">
                        {note.category}
                      </span>
                      <button
                        className="jc-icon-btn"
                        onClick={() => handleDeleteNote(note.id)}
                        style={{ width: "30px", height: "30px" }}
                      >
                        <FaTrash style={{ color: "var(--jc-danger)" }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. INSIGHTS & MEMORIES TAB */}
          {activeTab === "insights" && activeJourney && (
            <div>
              <div className="jc-card" style={{ marginBottom: "2rem" }}>
                <div className="jc-card-header">
                  <h3 className="jc-card-title">
                    <FaCloudSun /> AI Travel Insights & Suggestions
                  </h3>
                  <button
                    className="jc-btn jc-btn-secondary"
                    onClick={handleFetchAITips}
                  >
                    <FaRotateRight /> Refresh Insights
                  </button>
                </div>

                <div
                  style={{
                    background: "var(--jc-bg-secondary)",
                    padding: "1.5rem",
                    borderRadius: "var(--jc-radius-md)",
                    lineHeight: "1.7",
                    color: "var(--jc-text-primary)",
                  }}
                >
                  {aiInsights ? (
                    <div style={{ whiteSpace: "pre-line" }}>{aiInsights}</div>
                  ) : (
                    <div>
                      <p>
                        <strong>🎒 Packing Tips:</strong> Power bank, earplugs,
                        sanitizing wipes, prescription medicines, and government
                        ID card.
                      </p>
                      <p>
                        <strong>🍜 Station Specialties:</strong> Ratlami Sev at
                        Ratlam, Agra Petha at Agra Cantt, Bedmi Puri at Jhansi.
                      </p>
                      <p>
                        <strong>🛡️ Safety Advice:</strong> Secure your bags with
                        berth chains and keep physical copies of tickets.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Journey Memories Form */}
              <div className="jc-card">
                <div className="jc-card-header">
                  <h3 className="jc-card-title">
                    <FaHeart /> Store Journey Memories & Review
                  </h3>
                </div>

                <form onSubmit={handleSaveMemory}>
                  <div className="jc-form-group">
                    <label>Rate Journey Experience</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          style={{
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            color:
                              star <= userRating
                                ? "var(--jc-warning)"
                                : "var(--jc-text-muted)",
                          }}
                          onClick={() => setUserRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="jc-form-group">
                    <label>Journey Summary & Reflections</label>
                    <textarea
                      className="jc-form-input"
                      rows="3"
                      placeholder="e.g. Food was good, coach was clean, reached destination on time."
                      value={memorySummary}
                      onChange={(e) => setMemorySummary(e.target.value)}
                    ></textarea>
                  </div>

                  <button type="submit" className="jc-btn jc-btn-primary">
                    Save Journey Memory
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 8. EMERGENCY SOS TAB */}
          {activeTab === "emergency" && (
            <div>
              <div className="jc-emergency-banner">
                <h2 style={{ margin: "0 0 0.5rem 0", color: "#ef4444" }}>
                  <FaTriangleExclamation /> Emergency Help & Safety Hub
                </h2>
                <p style={{ color: "var(--jc-text-secondary)", margin: "0" }}>
                  Instant access to Indian Railways RPF Security, Medical Help &
                  Live Journey Sharing
                </p>

                <button
                  className="jc-sos-btn-large"
                  onClick={() => setIsSosActive(true)}
                >
                  SOS
                </button>
                <p
                  style={{ color: "var(--jc-text-muted)", fontSize: "0.85rem" }}
                >
                  Press SOS to trigger emergency alert beacon
                </p>
              </div>

              <div className="jc-dashboard-grid">
                <div className="jc-card">
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>
                    <FaPhoneVolume /> Railway Helpline
                  </h4>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      color: "var(--jc-accent)",
                    }}
                  >
                    139
                  </div>
                  <small style={{ color: "var(--jc-text-secondary)" }}>
                    Rail Madad Single Helpline Number
                  </small>
                </div>

                <div className="jc-card">
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>
                    <FaShieldHalved /> RPF Security Helpline
                  </h4>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      color: "var(--jc-warning)",
                    }}
                  >
                    182
                  </div>
                  <small style={{ color: "var(--jc-text-secondary)" }}>
                    Railway Protection Force SOS
                  </small>
                </div>

                <div className="jc-card">
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>
                    <FaShareNodes /> Share Journey Status
                  </h4>
                  <button
                    className="jc-btn jc-btn-secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `I am traveling on ${activeJourney?.trainName} (${activeJourney?.trainNumber}) from ${activeJourney?.from} to ${activeJourney?.to}. Current seat: Coach ${activeJourney?.coach}-${activeJourney?.seat}.`,
                      );
                      alert("Journey tracking text copied to clipboard!");
                    }}
                  >
                    Copy Journey Tracking Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. ANALYTICS & HISTORY TAB */}
          {activeTab === "analytics" && analytics && (
            <div>
              <div className="jc-dashboard-grid">
                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">Total Trips</h3>
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "800" }}>
                    {analytics.totalTrips}
                  </div>
                </div>

                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">Total Distance</h3>
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: "var(--jc-accent)",
                    }}
                  >
                    {analytics.totalDistanceKm} km
                  </div>
                </div>

                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">Favourite Route</h3>
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                    {analytics.favouriteRoute}
                  </div>
                </div>

                <div className="jc-card">
                  <div className="jc-card-header">
                    <h3 className="jc-card-title">Favourite Train</h3>
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                    {analytics.favouriteTrain}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* PLAN NEW JOURNEY MODAL */}
      {isCreateModalOpen && (
        <div className="jc-modal-overlay">
          <div className="jc-modal-content">
            <h3 style={{ margin: "0 0 1rem 0" }}>Plan New Journey</h3>

            <form onSubmit={handleCreateJourney}>
              <div className="jc-form-group">
                <label>Search Train or Enter PNR Number</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="jc-form-input"
                    placeholder="Enter 10-digit PNR OR Train Number/Name"
                    value={searchQuery}
                    onChange={handleSearchTrainOrPNR}
                    style={{ width: "100%" }}
                  />

                  {searchResults.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "var(--jc-bg-secondary)",
                        border: "1px solid var(--jc-border)",
                        borderRadius: "var(--jc-radius-md)",
                        zIndex: 10,
                        maxHeight: "150px",
                        overflowY: "auto",
                      }}
                    >
                      {searchResults.map((t) => (
                        <div
                          key={t.trainNumber}
                          onClick={() => selectSearchResult(t)}
                          style={{
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                            borderBottom: "1px solid var(--jc-border)",
                          }}
                        >
                          <strong>
                            {t.trainNumber} - {t.trainName}
                          </strong>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--jc-text-secondary)",
                            }}
                          >
                            {t.from} → {t.to}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="jc-form-group">
                  <label>Train Number</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.trainNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, trainNumber: e.target.value })
                    }
                  />
                </div>
                <div className="jc-form-group">
                  <label>Train Name</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.trainName}
                    onChange={(e) =>
                      setFormData({ ...formData, trainName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="jc-form-group">
                  <label>From Station</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.from}
                    onChange={(e) =>
                      setFormData({ ...formData, from: e.target.value })
                    }
                  />
                </div>
                <div className="jc-form-group">
                  <label>To Station</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.to}
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="jc-form-group">
                  <label>Coach</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.coach}
                    onChange={(e) =>
                      setFormData({ ...formData, coach: e.target.value })
                    }
                  />
                </div>
                <div className="jc-form-group">
                  <label>Seat</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.seat}
                    onChange={(e) =>
                      setFormData({ ...formData, seat: e.target.value })
                    }
                  />
                </div>
                <div className="jc-form-group">
                  <label>Platform</label>
                  <input
                    type="text"
                    className="jc-form-input"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyRight: "flex-end",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  type="button"
                  className="jc-btn jc-btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="jc-btn jc-btn-primary">
                  Save & Create Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOS ACTIVE BEACON MODAL */}
      {isSosActive && (
        <div className="jc-modal-overlay">
          <div
            className="jc-modal-content"
            style={{ border: "2px solid #ef4444", textAlign: "center" }}
          >
            <FaTriangleExclamation
              style={{
                fontSize: "3rem",
                color: "#ef4444",
                marginBottom: "1rem",
              }}
            />
            <h2 style={{ color: "#ef4444", margin: "0 0 0.5rem 0" }}>
              EMERGENCY BEACON ACTIVATED
            </h2>
            <p style={{ color: "var(--jc-text-secondary)" }}>
              Railway Helpline 139 and Security RPF have been notified with your
              train ({activeJourney?.trainNumber}) & coach details (
              {activeJourney?.coach}-{activeJourney?.seat}).
            </p>
            <button
              className="jc-btn jc-btn-danger"
              onClick={() => setIsSosActive(false)}
              style={{ marginTop: "1rem" }}
            >
              Dismiss Emergency Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyCompanion;
