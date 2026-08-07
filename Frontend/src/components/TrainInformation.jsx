import { useState } from "react";
import "../styles/trainInformation.css";

const TrainInformation = () => {
  const [trainNo, setTrainNo] = useState("12345");

  const stations = [
    {
      station: "New Delhi",
      arrival: "--",
      departure: "16:00",
      status: "Departed",
      icon: "🛫"
    },
    {
      station: "Kanpur",
      arrival: "20:30",
      departure: "20:35",
      status: "On Time",
      icon: "🚉"
    },
    {
      station: "Prayagraj",
      arrival: "22:45",
      departure: "22:50",
      status: "On Time",
      icon: "🚉"
    },
    {
      station: "Kolkata",
      arrival: "08:00",
      departure: "--",
      status: "Destination",
      icon: "🛬"
    },
  ];

  return (
    <div className="train-info-page">

      {/* 1. Professional Header with Premium Logo */}
      <div className="train-header">
        <h1><span>📋</span> Train Information</h1>
        <p>
          View live train routes, precise timing, 
          real-time running status, and complete station details.
        </p>
      </div>

      {/* 2. Premium Search Box */}
      <div className="search-card">
        <div className="input-with-icon">
          <span>🔍</span>
          <input
            type="text"
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value)}
            placeholder="Enter Train Number (e.g., 12345)"
          />
        </div>
        <button>Search Train</button>
      </div>

      {/* 3. Train Overview Cards with Icons */}
      <div className="train-overview">
        <div className="overview-card">
          <div className="card-icon">🚆</div>
          <div>
            <h2>12345</h2>
            <p>Rajdhani Express</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon live">🟢</div>
          <div>
            <h2>Running</h2>
            <p>Current Status</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon rate">⚡</div>
          <div>
            <h2>95%</h2>
            <p>On Time Rate</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon duration">🕒</div>
          <div>
            <h2>12h</h2>
            <p>Journey Duration</p>
          </div>
        </div>
      </div>

      {/* 4. Full Screen Route Timeline Box */}
      <div className="route-card">
        <h2><span>🗺️</span> Route Timeline</h2>

        <div className="station-table">
          {stations.map((item, index) => (
            <div key={index} className="station-row">
              <div className="station-name-block">
                <span className="station-icon">{item.icon}</span>
                <strong>{item.station}</strong>
              </div>

              <div className="time-block">
                <span>📥</span> Arr: {item.arrival}
              </div>

              <div className="time-block">
                <span>📤</span> Dep: {item.departure}
              </div>

              <div className={`status-badge ${item.status.toLowerCase().replace(" ", "-")}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. AI Prediction Insights */}
      <div className="insight-card">
        <h3>🤖 AI Prediction Insight</h3>
        <p>
          Train is currently running on schedule with exceptionally low delay risk. 
          Estimated arrival at final destination is <strong>08:00 AM</strong>.
        </p>
      </div>

    </div>
  );
};

export default TrainInformation;