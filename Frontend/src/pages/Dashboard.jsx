import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Seat Exchange", icon: "fa-right-left", path: "/seat-exchange" },
    { title: "PNR Verification", icon: "fa-ticket", path: "/pnr-verification" },
   
    { title: "QR Verification", icon: "fa-qrcode", path: "/qr-verification" },

    { title: "AI Recommendation", icon: "fa-robot", path: "/ai-recommendation" },
    { title: "Journey Companion", icon: "fa-user-group", path: "/journey-companion" },
    { title: "AI Chatbot", icon: "fa-comments", path: "/chatbot" },


    // { title: "Live Coach Map", icon: "fa-map-location-dot", path: "/live-coach-map" },
    { title: "Train Information", icon: "fa-train", path: "/train-information" },
    // { title: "Station Navigator", icon: "fa-location-dot", path: "/station-navigator" },
    // { title: "Reward System", icon: "fa-gift", path: "/reward-system" },

    { title: "Lost Item AI", icon: "fa-magnifying-glass", path: "/lost-item-ai" },
    { title: "Crowd Density", icon: "fa-chart-column", path: "/crowd-density" },
    // { title: "Women Safety", icon: "fa-shield-halved", path: "/women-safety" },
    { title: "Medical Match", icon: "fa-briefcase-medical", path: "/emergency-medical" },
    { title: "Project Records", icon: "fa-folder-open", path: "/project-records" },
  ];

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h1>RailSwap Dashboard</h1>
        <p>Smart Railway Passenger Assistance Platform</p>
      </div>

      <div className="dashboard-grid">

        {features.map((item, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={() => navigate(item.path)}
          >
            <div className="card-icon">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>

            <h3>{item.title}</h3>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Dashboard;