import { useState } from "react";
import "../styles/stationNavigator.css";

const StationNavigator = () => {
  const [destination, setDestination] = useState("");

  const locations = [
    {
      name: "Platform 1",
      distance: "120m",
      crowd: "Low",
      icon: "fa-train",
    },
    {
      name: "Platform 5",
      distance: "250m",
      crowd: "High",
      icon: "fa-train-subway",
    },
    {
      name: "Waiting Hall",
      distance: "80m",
      crowd: "Medium",
      icon: "fa-chair",
    },
    {
      name: "Food Court",
      distance: "150m",
      crowd: "Medium",
      icon: "fa-utensils",
    },
    {
      name: "Exit Gate",
      distance: "300m",
      crowd: "Low",
      icon: "fa-right-from-bracket",
    },
    {
      name: "Medical Room",
      distance: "90m",
      crowd: "Low",
      icon: "fa-kit-medical",
    },
  ];

  return (
    <div className="navigator-page">
      <div className="navigator-header">
        <div>
          <h1>🚉 Smart Station Navigator</h1>
          <p>
            AI-powered navigation for platforms, exits, food courts and station
            facilities.
          </p>
        </div>

        <button className="ai-btn">
          <i className="fa-solid fa-sparkles"></i>
          AI Route
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>12</h2>
          <p>Platforms</p>
        </div>

        <div className="stat-card">
          <h2>3 Min</h2>
          <p>Fastest Route</p>
        </div>

        <div className="stat-card">
          <h2>89%</h2>
          <p>Navigation Accuracy</p>
        </div>

        <div className="stat-card">
          <h2>24</h2>
          <p>Facilities</p>
        </div>
      </div>

      <div className="search-card">
        <i className="fa-solid fa-location-dot"></i>

        <input
          type="text"
          placeholder="Search platform, food court, exit..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <button>Navigate</button>
      </div>

      <div className="station-map-card">
        <div className="map-header">
          <div>
            <h2>Live Station Map</h2>
            <span>Current Location • Main Entrance</span>
          </div>

          <div className="live-badge">● Live</div>
        </div>

        <div className="map-grid">
          <div className="map-box entrance">Entrance</div>

          <div className="map-box waiting">Waiting Hall</div>

          <div className="map-box food">Food Court</div>

          <div className="map-box platform">Platform 1</div>

          <div className="map-box platform">Platform 2</div>

          <div className="map-box platform">Platform 3</div>

          <div className="map-box platform">Platform 4</div>

          <div className="map-box active-platform">Platform 5</div>
        </div>
      </div>

      <div className="location-grid">
        {locations.map((item, index) => (
          <div className="location-card" key={index}>
            <i className={`fa-solid ${item.icon}`}></i>

            <h3>{item.name}</h3>

            <p>{item.distance}</p>

            <span className={`crowd ${item.crowd.toLowerCase()}`}>
              {item.crowd} Crowd
            </span>

            <button>Open Route</button>
          </div>
        ))}
      </div>

      <div className="navigator-ai-card">
        <div className="ai-top">
          <h3>🤖 AI Navigation Assistant</h3>

          <span className="route-score">98% Optimal</span>
        </div>

        <ul>
          <li>✓ Fastest route found</li>
          <li>✓ Platform 5 crowd level high</li>
          <li>✓ Escalator available</li>
          <li>✓ Estimated walking time 3 min</li>
        </ul>
      </div>
    </div>
  );
};

export default StationNavigator;
