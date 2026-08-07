import { useState, useMemo } from "react";
import "../styles/liveCoachMap.css";

// Mock Data: इन सीटों के डेटा को कल को आप API से भी replace कर सकते हैं
const MOCK_SEATS_DATA = [
  { no: "1", type: "occupied", berth: "Lower" },
  { no: "2", type: "available", berth: "Middle" },
  { no: "3", type: "occupied", berth: "Upper" },
  { no: "4", type: "available", berth: "Side Lower" },
  { no: "5", type: "user", berth: "Side Upper" },
  { no: "6", type: "available", berth: "Lower" },
  { no: "7", type: "occupied", berth: "Middle" },
  { no: "8", type: "available", berth: "Upper" },
  { no: "9", type: "available", berth: "Lower" },
  { no: "10", type: "occupied", berth: "Middle" },
  { no: "11", type: "available", berth: "Upper" },
  { no: "12", type: "occupied", berth: "Side Lower" },
  { no: "13", type: "available", berth: "Side Upper" },
  { no: "14", type: "available", berth: "Lower" },
  { no: "15", type: "occupied", berth: "Middle" },
  { no: "16", type: "available", berth: "Upper" },
];

const COACH_OPTIONS = ["B1", "B2", "B3", "S1", "S2"];

const LiveCoachMap = () => {
  const [selectedCoach, setSelectedCoach] = useState("B2");
  
  // UseMemo का इस्तेमाल performance बेहतर करने और real-time stats calculate करने के लिए
  const stats = useMemo(() => {
    const total = MOCK_SEATS_DATA.length;
    const available = MOCK_SEATS_DATA.filter(s => s.type === "available").length;
    const occupied = MOCK_SEATS_DATA.filter(s => s.type === "occupied").length;
    const occupancyPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    const availableLowerBerths = MOCK_SEATS_DATA
      .filter(s => s.type === "available" && s.berth === "Lower")
      .map(s => s.no);

    return {
      available,
      occupancyPercentage,
      availableLowerBerths: availableLowerBerths.length > 0 ? availableLowerBerths.join(", ") : "None"
    };
  }, []);

  return (
    <div className="live-coach-container">
      {/* Header Section */}
      <header className="live-coach-header">
        <div className="header-title-area">
          <h1>Live Coach Map</h1>
          <p>View real-time coach layout, occupancy, and your current seat position.</p>
        </div>

        <div className="coach-selector-wrapper">
          <label htmlFor="coach-select">Select Coach:</label>
          <select
            id="coach-select"
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
            className="coach-dropdown"
          >
            {COACH_OPTIONS.map((coach) => (
              <option key={coach} value={coach}>{coach}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="stats-dashboard">
        <div className="stat-card">
          <span className="stat-value">{stats.occupancyPercentage}%</span>
          <span className="stat-label">Occupancy</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{stats.available}</span>
          <span className="stat-label">Available Seats</span>
        </div>

        <div className="stat-card highlight">
          <span className="stat-value">{selectedCoach}</span>
          <span className="stat-label">Current Coach</span>
        </div>
      </section>

      {/* Legend Indicator */}
      <div className="map-legend" aria-label="Seat Legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span className="legend-text">Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color occupied"></span>
          <span className="legend-text">Occupied</span>
        </div>
        <div className="legend-item">
          <span className="legend-color user-seat"></span>
          <span className="legend-text">Your Seat</span>
        </div>
      </div>

      {/* Layout Grid Map */}
      <main className="coach-layout-section">
        <div className="coach-badge">Coach {selectedCoach}</div>
        
        <div className="seats-grid">
          {MOCK_SEATS_DATA.map((seat) => (
            <button
              key={seat.no}
              className={`seat-item ${seat.type}`}
              title={`Seat ${seat.no} (${seat.berth}) - ${seat.type}`}
              disabled={seat.type === "occupied"}
            >
              <span className="seat-number">{seat.no}</span>
              <span className="seat-berth-tag">{seat.berth.split(" ").map(w => w[0]).join("")}</span>
            </button>
          ))}
        </div>
      </main>

      {/* AI Insights Card */}
      <footer className="ai-insights-card">
        <div className="insights-header">
          <span className="bot-icon">🤖</span>
          <h3>AI Coach Insight</h3>
        </div>
        <p>
          Coach <strong>{selectedCoach}</strong> currently has{" "}
          {stats.occupancyPercentage > 60 ? "high" : "medium"} crowd density. 
          Available lower berths: <strong>{stats.availableLowerBerths}</strong>. 
          Recommended coach for a better seat exchange: <strong>{selectedCoach === "B2" ? "B1" : "B2"}</strong>.
        </p>
      </footer>
    </div>
  );
};

export default LiveCoachMap;