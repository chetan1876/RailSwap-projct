import { useMemo, useState } from "react";
import "../styles/coachHeatmap.css";

const coachData = {
  B1: [
    "available","available","occupied","medium",
    "available","occupied","available","available",
    "occupied","medium","available","available",
    "occupied","available","medium","available",
    "available","occupied","available","available",
    "occupied","medium","available","occupied",
    "available","available","occupied","medium"
  ],

  B2: [
    "available","occupied","occupied","occupied",
    "medium","available","occupied","medium",
    "available","available","occupied","occupied",
    "medium","available","occupied","available",
    "available","medium","occupied","available",
    "occupied","medium","available","available",
    "occupied","occupied","available","medium"
  ],

  B3: [
    "available","available","available","medium",
    "available","available","medium","available",
    "occupied","available","available","available",
    "medium","available","available","available",
    "available","medium","occupied","available",
    "available","medium","available","available",
    "occupied","available","available","medium"
  ],

  S1: [
    "occupied","occupied","occupied","medium",
    "occupied","medium","occupied","occupied",
    "medium","occupied","occupied","occupied",
    "medium","occupied","occupied","occupied",
    "medium","occupied","occupied","occupied",
    "occupied","medium","occupied","occupied",
    "occupied","medium","occupied","occupied"
  ],

  S2: [
    "available","medium","available","available",
    "medium","available","occupied","available",
    "available","medium","available","available",
    "occupied","available","medium","available",
    "available","occupied","available","available",
    "medium","available","occupied","available",
    "available","medium","available","available"
  ]
};

const CoachHeatmap = () => {

  const [selectedCoach, setSelectedCoach] = useState("B2");

  const seats = coachData[selectedCoach];

  const stats = useMemo(() => {

    const available = seats.filter(
      seat => seat === "available"
    ).length;

    const occupied = seats.filter(
      seat => seat === "occupied"
    ).length;

    const medium = seats.filter(
      seat => seat === "medium"
    ).length;

    const occupancy =
      Math.round((occupied / seats.length) * 100);

    return {
      available,
      occupied,
      medium,
      occupancy
    };

  }, [seats]);

  const bestCoach = useMemo(() => {

    let coach = "";
    let min = 100;

    Object.keys(coachData).forEach((item) => {

      const occupied =
        coachData[item].filter(
          seat => seat === "occupied"
        ).length;

      if (occupied < min) {
        min = occupied;
        coach = item;
      }

    });

    return coach;

  }, []);

  return (

    <div className="heatmap-page">

      <div className="page-header">

        <div>

          <h1>🚆 Coach Heatmap Dashboard</h1>

          <p>
            Live visualization of crowd density
            and seat availability.
          </p>

        </div>

        <select
          className="coach-dropdown"
          value={selectedCoach}
          onChange={(e) =>
            setSelectedCoach(e.target.value)
          }
        >
          {Object.keys(coachData).map(coach => (
            <option
              key={coach}
              value={coach}
            >
              {coach}
            </option>
          ))}
        </select>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <h2>{stats.available}</h2>

          <p>Available</p>

        </div>

        <div className="stat-card">

          <h2>{stats.occupied}</h2>

          <p>Occupied</p>

        </div>

        <div className="stat-card">

          <h2>{stats.medium}</h2>

          <p>Medium</p>

        </div>

        <div className="stat-card">

          <h2>{stats.occupancy}%</h2>

          <p>Occupancy</p>

        </div>

      </div>

      <div className="progress-card">

        <div className="progress-header">

          <span>Crowd Density</span>

          <span>{stats.occupancy}%</span>

        </div>

        <div className="progress">

          <div
            className="progress-fill"
            style={{
              width: `${stats.occupancy}%`
            }}
          />

        </div>

      </div>

      <div className="legend">

        <div>
          <span className="green"></span>
          Available
        </div>

        <div>
          <span className="yellow"></span>
          Medium
        </div>

        <div>
          <span className="red"></span>
          Occupied
        </div>

      </div>

      <div className="coach-grid">

        {seats.map((seat, index) => (

          <div
            key={index}
            className={`seat ${seat}`}
          >

            <span>{index + 1}</span>

          </div>

        ))}

      </div>

      <div className="ai-card">

        <h3>🤖 AI Recommendation</h3>

        <p>

          Current coach
          <strong> {selectedCoach}</strong>
          is running at
          <strong> {stats.occupancy}%</strong>
          occupancy.

        </p>

        <p>

          Recommended coach for seat exchange:
          <strong> {bestCoach}</strong>

        </p>

      </div>

    </div>

  );

};

export default CoachHeatmap;