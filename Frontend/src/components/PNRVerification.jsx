import  { useState } from "react";
import axios from "axios";
import "../styles/pnrVerification.css";

const PNRVerification = () => {
  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // VERIFY PNR
  // ==========================================
  const verifyPNR = async () => {
    // Strict 10 digit validation
    if (!/^\d{10}$/.test(pnr)) {
      setError("Please enter a valid 10-digit PNR number.");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      // Vite compatible API URL setup
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.post(
        `${API_URL}/api/pnr/verify`,
        { pnr: pnr },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("PNR Response:", response.data);

      if (response.data && response.data.success) {
        setResult(response.data);
      } else {
        setError(
          response.data?.message || "PNR verification failed. Invalid response structure."
        );
      }
    } catch (err) {
      console.error("PNR Verification Error:", err);

      if (err.code === "ERR_NETWORK") {
        setError("Backend server is not reachable. Please check if Express app is running on port 5000.");
      } else {
        setError(
          err.response?.data?.message ||
          "PNR not found or server error during verification."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ENTER KEY HANDLER
  // ==========================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      verifyPNR();
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================
  const clearSearch = () => {
    setPnr("");
    setResult(null);
    setError("");
  };

  // ==========================================
  // EXCHANGE BUTTON
  // ==========================================
  const handleExchangeSeat = () => {
    alert("PNR Verified Successfully. Seat Exchange connection will be added next.");
  };

  return (
    <div className="pnr-container">
      {/* HERO SECTION */}
      <section className="pnr-hero">
        <div className="hero-left">
          <div className="hero-badge">🚆 RAILSWAP PNR VERIFICATION</div>
          <h1>
            Verify Your <span>Railway Journey</span>
          </h1>
          <p>
            Enter your 10-digit PNR number to securely verify your train journey and ticket details.
          </p>

          <div className="hero-features">
            <div>✓ Secure Verification</div>
            <div>✓ Journey Details</div>
            <div>✓ Seat Exchange Ready</div>
          </div>
        </div>

        <div className="hero-train-icon">🚆</div>
      </section>

      {/* SEARCH CARD */}
      <section className="pnr-search-card">
        <div className="search-heading">
          <div className="search-icon">🔍</div>
          <div>
            <h2>Check PNR Status</h2>
            <p>Enter your 10-digit Passenger Name Record number</p>
          </div>
        </div>

        <div className="search-area">
          <div className="pnr-input-wrapper">
            <label htmlFor="pnrInput">PNR Number</label>
            <div className="input-box">
              <input
                id="pnrInput"
                type="text"
                value={pnr}
                maxLength={10}
                placeholder="Enter 10 digit PNR"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPnr(value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
              />
              <span>{pnr.length}/10</span>
            </div>
          </div>

          <button
            className="verify-button"
            onClick={verifyPNR}
            disabled={loading || pnr.length !== 10}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Verifying...
              </>
            ) : (
              <>✓ Verify PNR</>
            )}
          </button>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
      </section>

      {/* PNR RESULT CARD */}
      {result && (
        <section className="pnr-result-card">
          <div className="result-header">
            <div>
              <div className="verified-text">✓ TICKET VERIFIED</div>
              <h2>Journey Details</h2>
              <p>Your PNR has been successfully verified.</p>
            </div>
            <div className="confirmed-badge">
              ✓ {result.status || "CONFIRMED"}
            </div>
          </div>

          <div className="pnr-number-section">
            <div>
              <span>PNR NUMBER</span>
              <strong>{result.pnr || pnr}</strong>
            </div>
            <button className="clear-button" onClick={clearSearch}>
              New Search
            </button>
          </div>

          <div className="train-section">
            <div className="train-heading">
              <div className="train-circle">🚆</div>
              <div>
                <h3>{result.trainName || "Train Name"}</h3>
                <p>Train Number: {result.trainNumber || "N/A"}</p>
              </div>
            </div>

            <div className="journey-route">
              <div className="station-block">
                <span>BOARDING</span>
                <strong>{result.from || "N/A"}</strong>
              </div>

              <div className="route-visual">
                <div className="route-line"></div>
                <div className="route-train">🚆</div>
              </div>

              <div className="station-block destination">
                <span>DESTINATION</span>
                <strong>{result.to || "N/A"}</strong>
              </div>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span>JOURNEY DATE</span>
              <strong>{result.journeyDate || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>COACH</span>
              <strong>{result.coach || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>SEAT NUMBER</span>
              <strong>{result.seatNumber || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>BERTH TYPE</span>
              <strong>{result.seatType || "N/A"}</strong>
            </div>
          </div>

          <div className="verification-footer">
            <div className="verification-status">
              <div className="success-icon">✓</div>
              <div>
                <strong>Ticket Verified Successfully</strong>
                <p>Your journey details are verified and ready for Seat Exchange.</p>
              </div>
            </div>

            <button className="exchange-button" onClick={handleExchangeSeat}>
              🔄 Exchange This Seat
            </button>
          </div>
        </section>
      )}

      {/* INFORMATION SECTION */}
      {!result && (
        <section className="info-section">
          <h2>How PNR Verification Works</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-number">01</div>
              <h3>Enter PNR</h3>
              <p>Enter your valid 10-digit PNR number in the verification box.</p>
            </div>

            <div className="info-card">
              <div className="info-number">02</div>
              <h3>Verify Journey</h3>
              <p>RailSwap verifies your PNR and displays your journey and seat information.</p>
            </div>

            <div className="info-card">
              <div className="info-number">03</div>
              <h3>Exchange Seat</h3>
              <p>After verification, you can proceed to the Seat Exchange feature.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PNRVerification;