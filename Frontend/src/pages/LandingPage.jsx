import { Link } from "react-router-dom";
import "../styles/landing.css";

const LandingPage = () => {
  const features = [
  {
    title: "Seat Exchange",
    icon: "fa-right-left",
    desc: "Exchange seats with verified passengers."
  },
  {
    title: "PNR Verification",
    icon: "fa-ticket",
    desc: "Verify journey details using PNR."
  },
  {
    title: "Family Auto Linking",
    icon: "fa-people-group",
    desc: "Automatically connect family travelers."
  },
  {
    title: "Seat Exchange History",
    icon: "fa-clock-rotate-left",
    desc: "View all previous exchange records."
  },
  {
    title: "QR Verification",
    icon: "fa-qrcode",
    desc: "Instant QR based passenger validation."
  },
  {
    title: "Multi-Person Exchange",
    icon: "fa-users",
    desc: "Swap seats among multiple travelers."
  },
  {
    title: "Temporary Exchange",
    icon: "fa-repeat",
    desc: "Short duration seat exchange support."
  },
  {
    title: "AI Recommendation",
    icon: "fa-robot",
    desc: "AI suggests best seat options."
  },
  {
    title: "Journey Companion",
    icon: "fa-user-group",
    desc: "Find compatible co-travelers."
  },
  {
    title: "AI Chatbot",
    icon: "fa-comments",
    desc: "24x7 railway assistance chatbot."
  },
  {
    title: "Coach Heatmap",
    icon: "fa-chart-column",
    desc: "Visual coach occupancy overview."
  },
  {
    title: "Live Coach Map",
    icon: "fa-map-location-dot",
    desc: "Real-time coach navigation."
  },
  {
    title: "Train Information",
    icon: "fa-train",
    desc: "Complete train details and status."
  },
  {
    title: "Station Navigator",
    icon: "fa-location-dot",
    desc: "Navigate stations with ease."
  },
  {
    title: "Reward System",
    icon: "fa-gift",
    desc: "Earn rewards for participation."
  },
  {
    title: "Lost Item Detection",
    icon: "fa-magnifying-glass",
    desc: "AI-powered lost item support."
  },
  {
    title: "Crowd Density Prediction",
    icon: "fa-users-viewfinder",
    desc: "Predict coach crowd levels."
  },
  {
    title: "Women Safety Matching",
    icon: "fa-shield-heart",
    desc: "Safe travel recommendations."
  },
  {
    title: "Emergency Medical Match",
    icon: "fa-briefcase-medical",
    desc: "Locate nearby medical support."
  }
];

  const faqs = [
    {
      q: "What is RailSwap?",
      a: "RailSwap is an AI-powered railway passenger assistance platform designed to improve comfort, safety, and travel experience.",
    },
    {
      q: "Is seat exchange secure?",
      a: "Yes. All exchanges are validated through the platform to ensure passenger safety and authenticity.",
    },
    {
      q: "Can I access future modules?",
      a: "Yes. New AI-powered modules will be available in future updates.",
    },
  ];

  return (
    <div className="landing">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-left">

          <span className="hero-badge">
            🚆 AI Powered Railway Platform
          </span>

          <h1>
            Smart Railway Seat Exchange &
            Passenger Assistance Platform
          </h1>

          <p>
            AI powered seat recommendations,
            journey companion matching,
            emergency medical support,
            women safety assistance,
            crowd prediction and passenger
            comfort in one intelligent platform.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-btn"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="secondary-btn"
            >
              Login
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <h3>100K+</h3>
              <p>Passengers</p>
            </div>

            <div>
              <h3>50K+</h3>
              <p>Exchanges</p>
            </div>

            <div>
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>

          </div>

        </div>

        <div className="hero-right">

          <div className="hero-card">

            <h3>🤖 AI Seat Recommendation</h3>

            <p>
              Recommended Seat:
              Lower Berth - Coach B2
            </p>

            <div className="hero-progress">
              <div></div>
            </div>

            <span>98% Match Score</span>

          </div>

          <div className="hero-card small-card">

            <h4>👥 Journey Companion Match</h4>

            <p>
              3 Compatible Travelers Found
            </p>

          </div>

          <div className="hero-card small-card">

            <h4>🛡 Women Safety</h4>

            <p>
              Safe Seat Suggestions Available
            </p>

          </div>

          <div className="hero-card small-card">

            <h4>🎫 Seat Exchange</h4>

            <p>
              12 Active Exchange Requests
            </p>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

    <section className="features">

  <div className="section-header">
    <span>FEATURES</span>

    <h2>Complete RailSwap Ecosystem</h2>

    <p>
      Smart railway assistance platform with
      AI powered passenger services.
    </p>
  </div>

  <div className="feature-grid">

    {features.map((item, index) => (

      <div
        className="feature-card"
        key={index}
      >

        <div className="feature-icon">
          <i className={`fa-solid ${item.icon}`}></i>
        </div>

        <h3>{item.title}</h3>

        <p>{item.desc}</p>

      </div>

    ))}

  </div>

</section> 

       

      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat-card">
          <h2>100K+</h2>
          <p>Users</p>
        </div>

        <div className="stat-card">
          <h2>50K+</h2>
          <p>Exchanges</p>
        </div>

        <div className="stat-card">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>

      </section>

      {/* ================= FAQ ================= */}

      <section className="faq">

        <h2>Frequently Asked Questions</h2>

        {faqs.map((faq, index) => (
          <div
            className="faq-item"
            key={index}
          >
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <h3>🚆 RailSwap</h3>

        <p>
          AI Powered Railway Seat Exchange &
          Passenger Assistance Platform
        </p>

        <small>
          © 2026 RailSwap. All Rights Reserved.
        </small>

      </footer>

    </div>
  );
};

export default LandingPage;