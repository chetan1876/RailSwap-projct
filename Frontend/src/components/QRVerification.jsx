import { useState } from "react";

import QRCode from "react-qr-code";
import "../styles/qrVerification.css";

import {
  FaQrcode,
  FaCamera,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const QRVerification = () => {
  /* ==========================
         SCREEN STATE
  ========================== */

  const [screen, setScreen] = useState("home");

  /* ==========================
         QR DATA
  ========================== */

  const [qrData, setQrData] = useState({
    passenger: "Chetan Kumar",
    pnr: "2456789012",
    coach: "B2",
    seat: "32",
  });

  /* ==========================
      RECENT ACTIVITIES
  ========================== */

  const activities = [
    {
      id: 1,
      seat: "B2-32 → B2-48",
      status: "Completed",
      time: "2 min ago",
      icon: <FaCheckCircle className="success" />,
    },

    {
      id: 2,
      seat: "S3-18 → S3-25",
      status: "Pending",
      time: "Just now",
      icon: <FaClock className="pending" />,
    },

    {
      id: 3,
      seat: "A1-05 → A1-09",
      status: "Cancelled",
      time: "Yesterday",
      icon: <FaTimesCircle className="cancel" />,
    },
  ];

  return (
    <div className="qr-page">
      <div className="qr-container">

        {/* Home Screen yaha se start hoga */}

        {screen === "home" && (
  <>
    {/* Header */}
    <div className="qr-header">

      <div className="header-badge">
        🚆 RailSwap Secure
      </div>

      <h1>QR Seat Exchange</h1>

      <p>
        Exchange your railway seat securely using encrypted QR
        verification. Every exchange requires passenger
        verification and double confirmation.
      </p>

    </div>

    {/* Cards */}
    <div className="qr-card-wrapper">

      {/* Generate QR Card */}
      <div className="feature-card">

        <div className="feature-top">

          <div className="feature-icon">
            <FaQrcode />
          </div>

          <span className="feature-badge">
            Secure
          </span>

        </div>

        <h2>Generate Exchange QR</h2>

        <p>
          Create a secure QR that another verified passenger
          can scan to begin the seat exchange.
        </p>

        <div className="mini-preview">

          <div className="mini-qr">
            ▣
          </div>

          <div>
            <strong>Expires in 5 Minutes</strong>
            <small>End-to-end encrypted</small>
          </div>

        </div>

        <button
          className="primary-btn"
          onClick={() => setScreen("generate")}
        >
          Generate QR
          <FaArrowRight />
        </button>

      </div>

      {/* Scan Card */}
      <div className="feature-card">

        <div className="feature-top">

          <div className="feature-icon">
            <FaCamera />
          </div>

          <span className="feature-badge blue">
            Verified
          </span>

        </div>

        <h2>Scan Passenger QR</h2>

        <p>
          Scan another passenger's QR to verify
          the request and continue with secure
          seat exchange.
        </p>

        <div className="mini-preview">

          <div className="scanner-box">
            ⌖
          </div>

          <div>
            <strong>Camera Ready</strong>
            <small>Scan instantly</small>
          </div>

        </div>

        <button
          className="secondary-btn"
          onClick={() => setScreen("scan")}
        >
          Open Scanner
          <FaArrowRight />
        </button>

      </div>

    </div>

    {/* Activity */}
    <div className="activity-section">

      <div className="activity-title">
        <h2>Recent Exchange Activity</h2>
      </div>

      <div className="activity-list">

        {activities.map((item) => (

          <div
            className="activity-card"
            key={item.id}
          >

            <div className="activity-left">
              {item.icon}
              <span>{item.seat}</span>
            </div>

            <div className="activity-right">

              <div
                className={`status-pill ${item.status.toLowerCase()}`}
              >
                {item.status}
              </div>

              <small>{item.time}</small>

            </div>

          </div>

        ))}

      </div>

    </div>
  </>
)}

{screen === "generate" && (
  <div className="generate-screen">

    <button
      className="back-btn"
      onClick={() => setScreen("home")}
    >
      ← Back
    </button>

    <div className="generate-card">

      <div className="generate-header">

        <h2>Secure QR Generated</h2>

        <p>
          Ask the other passenger to scan this QR code to start
          the seat exchange process.
        </p>

      </div>

      <div className="qr-wrapper">

        <QRCode
          value={JSON.stringify(qrData)}
          size={220}
        />

      </div>

      <div className="details-grid">

        <div className="detail-box">

          <span>Passenger</span>

          <strong>{qrData.passenger}</strong>

        </div>

        <div className="detail-box">

          <span>PNR</span>

          <strong>{qrData.pnr}</strong>

        </div>

        <div className="detail-box">

          <span>Coach</span>

          <strong>{qrData.coach}</strong>

        </div>

        <div className="detail-box">

          <span>Seat</span>

          <strong>{qrData.seat}</strong>

        </div>

      </div>

      <div className="generate-buttons">

        <button
          className="primary-btn"
          onClick={() =>
            setQrData({
              ...qrData,
            })
          }
        >
          Generate New QR
        </button>

        <button
          className="secondary-btn"
          onClick={() => setScreen("scan")}
        >
          Open Scanner
        </button>

      </div>

    </div>

  </div>
)}

{screen === "scan" && (

<div className="scan-screen">

    <button
        className="back-btn"
        onClick={() => setScreen("home")}
    >
        ← Back
    </button>

    <div className="scan-card">

        <div className="scan-header">

            <h2>Scan Passenger QR</h2>

            <p>
                Point your camera at the passenger's QR code
                to verify the seat exchange request.
            </p>

        </div>

        <div className="camera-preview">

            <div className="camera-frame">

                <FaCamera />

                <span>Camera Preview</span>

            </div>

        </div>

        <div className="scan-info">

            <div className="scan-item">

                <strong>Status</strong>

                <span>Waiting for QR...</span>

            </div>

            <div className="scan-item">

                <strong>Security</strong>

                <span>Encrypted Verification</span>

            </div>

        </div>

        <div className="generate-buttons">

            <button
                className="primary-btn"
                onClick={() => setScreen("preview")}
            >
                Demo Scan Success
            </button>

            <button
                className="secondary-btn"
                onClick={() => setScreen("home")}
            >
                Cancel
            </button>

        </div>

    </div>

</div>

)}

{screen === "preview" && (

<div className="preview-screen">

    <button
        className="back-btn"
        onClick={() => setScreen("scan")}
    >
        ← Back
    </button>

    <div className="preview-card">

        <div className="preview-header">

            <h2>Exchange Preview</h2>

            <p>
                Verify passenger details before confirming the seat exchange.
            </p>

        </div>

        <div className="preview-grid">

            <div className="preview-box">

                <h3>Your Details</h3>

                <p><strong>Name:</strong> {qrData.passenger}</p>

                <p><strong>PNR:</strong> {qrData.pnr}</p>

                <p><strong>Seat:</strong> {qrData.coach}-{qrData.seat}</p>

            </div>

            <div className="preview-box">

                <h3>Other Passenger</h3>

                <p><strong>Name:</strong> Rahul Sharma</p>

                <p><strong>PNR:</strong> 9876543210</p>

                <p><strong>Seat:</strong> B2-48</p>

            </div>

        </div>

        <div className="exchange-summary">

            <h3>Seat Exchange</h3>

            <div className="seat-flow">

                <span>B2-32</span>

                <FaArrowRight />

                <span>B2-48</span>

            </div>

        </div>

        <div className="generate-buttons">

            <button
                className="primary-btn"
                onClick={() => setScreen("success")}
            >
                Confirm Exchange
            </button>

            <button
                className="secondary-btn"
                onClick={() => setScreen("home")}
            >
                Reject
            </button>

        </div>

    </div>

</div>

)}

{screen === "success" && (

<div className="success-screen">

    <div className="success-card">

        <div className="success-icon">

            ✅

        </div>

        <h2>

            Seat Exchange Successful

        </h2>

        <p>

            Both passengers have confirmed the exchange.
            Your journey details have been updated successfully.

        </p>

        <div className="success-details">

            <div className="success-item">

                <span>Old Seat</span>

                <strong>B2-32</strong>

            </div>

            <div className="success-item">

                <span>New Seat</span>

                <strong>B2-48</strong>

            </div>

            <div className="success-item">

                <span>Status</span>

                <strong className="success-text">
                    Confirmed
                </strong>

            </div>

            <div className="success-item">

                <span>Exchange ID</span>

                <strong>#RS245678</strong>

            </div>

        </div>

        <div className="generate-buttons">

            <button
                className="primary-btn"
                onClick={() => setScreen("home")}
            >
                Start New Exchange
            </button>

            <button
                className="secondary-btn"
                onClick={() => alert("Receipt Download Coming Soon")}
            >
                Download Receipt
            </button>

        </div>

    </div>

</div>

)}




      </div>
    </div>
  );
};

export default QRVerification;