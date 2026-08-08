import { useEffect, useState } from "react";
import SeatExchangeForm from "./SeatExchangeForm";
import {
  createSeatExchangeRequest,
  processPaytmPostAcceptancePayment,
  getAllSeatExchangeRequests,
  findMatchingPassengers,
  acceptSeatExchange,
  rejectSeatExchange,
  cancelSeatExchange,
  getPaymentHistory,
} from "../services/seatExchange.service";
import api from "../services/api";

import {
  requestNotificationPermission,
  listenForMessages,
} from "../firebase";

import "../styles/seatExchange.css";

const SeatExchange = () => {
  // =====================================================
  // STATE
  // =====================================================
  const [activeTab, setActiveTab] = useState("requester"); // 'requester' | 'receiver' | 'matches' | 'history' | 'payments'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [latestRequest, setLatestRequest] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Paytm Post-Acceptance Payment Modal State
  const [showPaytmModal, setShowPaytmModal] = useState(false);
  const [unlockedPaymentRequest, setUnlockedPaymentRequest] = useState(null);
  const [processingPaytm, setProcessingPaytm] = useState(false);

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Structured Review Packet State
  const [reviewPacket, setReviewPacket] = useState(null);
  const [reviewPacketRequest, setReviewPacketRequest] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Filter State
  const [coachFilter, setCoachFilter] = useState("ALL");
  const [berthFilter, setBerthFilter] = useState("ALL");

  // =====================================================
  // FIREBASE NOTIFICATIONS
  // =====================================================
  useEffect(() => {
    let unsubscribe = null;

    const setupNotifications = async () => {
      try {
        await requestNotificationPermission();
        unsubscribe = await listenForMessages((payload) => {
          const title = payload.notification?.title || "Seat Exchange Alert";
          const body = payload.notification?.body || "Update on your seat exchange.";
          setMessage(`🔔 ${title}: ${body}`);
        });
      } catch (error) {
        console.warn("Notification setup:", error.message);
      }
    };

    setupNotifications();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // =====================================================
  // FETCH REQUESTS & PAYMENTS
  // =====================================================
  const fetchRequests = async () => {
    try {
      const res = await getAllSeatExchangeRequests();
      const list = res.data || [];
      setRequests(list);

      const myReq = list.find((item) => item.user === "user123" || item.user === "user");
      if (myReq) {
        setLatestRequest(myReq);
      }
    } catch (error) {
      console.error("Fetch Requests Error:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await getPaymentHistory("user123");
      setPaymentHistory(res.data || []);
    } catch (error) {
      console.error("Fetch Payments Error:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchPayments();
  }, []);

  // =====================================================
  // SUBMIT REQUEST (Directly in PENDING state - No upfront payment)
  // =====================================================
  const submitSeatExchange = async (formData) => {
    try {
      setLoading(true);
      setMessage("");
      setErrorMsg("");

      const res = await createSeatExchangeRequest(formData);
      const created = res.data;

      setLatestRequest(created);
      setMessage("✓ Seat exchange request posted in Pending status! No payment required now.");

      await fetchRequests();
      setActiveTab("requester");
    } catch (error) {
      console.error("Submit Request Error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to create seat exchange request.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RECEIVER ACCEPTS SEAT SWAP -> UNLOCKS PAYTM SCREEN FOR REQUESTER
  // =====================================================
  const handleAccept = async (requestId, targetUserId) => {
    try {
      setMessage("");
      setErrorMsg("");

      const res = await acceptSeatExchange(requestId, targetUserId || "user123");
      const updatedItem = res.data;

      setMessage("🎉 Seat Exchange Confirmed! Give Reward option has been unlocked for the requester.");

      // Update state locally
      setRequests((prev) =>
        prev.map((item) => (item.id === requestId ? updatedItem : item))
      );
      setMatches((prev) =>
        prev.map((item) => (item.id === requestId ? updatedItem : item))
      );

      await fetchRequests();
    } catch (error) {
      console.error("Accept Error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to accept seat exchange.");
    }
  };

  // =====================================================
  // REQUESTER GIVES REWARD VIA PAYTM AFTER ACCEPTANCE
  // =====================================================
  const handlePaytmPayment = async () => {
    if (!unlockedPaymentRequest) return;

    try {
      setProcessingPaytm(true);
      setErrorMsg("");

      const res = await processPaytmPostAcceptancePayment({
        requestId: unlockedPaymentRequest.id,
        amount: 50,
        paymentMethod: "PAYTM",
      });

      setMessage(`✅ Reward processed successfully! (Txn ID: ${res.transactionId}). Exchange Completed!`);
      setShowPaytmModal(false);
      setUnlockedPaymentRequest(null);

      await fetchRequests();
      await fetchPayments();
    } catch (error) {
      console.error("Paytm Payment Error:", error);
      setErrorMsg(error.response?.data?.message || "Paytm payment processing failed. Try again.");
    } finally {
      setProcessingPaytm(false);
    }
  };

  // =====================================================
  // FIND MATCHING PASSENGERS
  // =====================================================
  const findMatches = async (targetRequest = null) => {
    const req = targetRequest || latestRequest || requests[0];

    if (!req) {
      setMessage("Please submit a seat exchange request first.");
      return;
    }

    try {
      setMatchLoading(true);
      setMessage("");
      setErrorMsg("");
      setActiveTab("matches");

      const res = await findMatchingPassengers({
        trainNumber: req.trainNumber,
        journeyDate: req.journeyDate,
        boardingStation: req.boardingStation,
        destinationStation: req.destinationStation,
        preferredCoach: req.preferredCoach,
        preferredSeatNumber: req.preferredSeatNumber,
        requestId: req.id,
      });

      setMatches(res.data || []);
      if (res.data?.length === 0) {
        setMessage("No matching passengers found on this train/date currently.");
      } else {
        setMessage(`Found ${res.data.length} matching passengers using AI match scoring!`);
      }
    } catch (error) {
      console.error("Find Matches Error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to search matching passengers.");
    } finally {
      setMatchLoading(false);
    }
  };

  // =====================================================
  // REJECT / CANCEL REQUEST
  // =====================================================
  const handleReject = async (requestId) => {
    try {
      setMessage("");
      setErrorMsg("");
      await rejectSeatExchange(requestId);
      setMessage("Seat exchange request rejected.");
      setMatches((prev) => prev.filter((item) => item.id !== requestId));
      await fetchRequests();
    } catch (error) {
      console.error("Reject Error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to reject request.");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      setMessage("");
      setErrorMsg("");
      await cancelSeatExchange(requestId);
      setMessage("Seat exchange request cancelled successfully.");
      await fetchRequests();
    } catch (error) {
      console.error("Cancel Error:", error);
      setErrorMsg(error.response?.data?.message || "Failed to cancel request.");
    }
  };

  // =====================================================
  // GENERATE STRUCTURED REVIEW PACKET
  // =====================================================
  const handleGenerateReviewPacket = async (item) => {
    if (!item?.id) return;

    if (item.status !== "COMPLETED" && item.status !== "PAYMENT_SUCCESSFUL") {
      setErrorMsg("Review Packet can only be generated after the seat exchange is completed.");
      return;
    }

    try {
      setReviewLoading(true);
      setErrorMsg("");
      setMessage("");

      const response = await api.post(`/seat-exchange/review-packet/${item.id}`, {
        userNotes: reviewNotes || "",
      });

      const packet = response.data?.data || response.data;
      setReviewPacketRequest(item);
      setReviewPacket(packet);
      setMessage("✓ Structured Review Packet generated successfully.");
    } catch (error) {
      console.error("Review Packet Error:", error);
      setErrorMsg(
        error.response?.data?.message ||
        "Failed to generate Review Packet."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // =====================================================
  // DOWNLOAD / PRINT REVIEW PACKET
  // Browser print dialog can be used to Save as PDF.
  // =====================================================
  const handleDownloadReviewPacket = () => {
    if (!reviewPacket) return;

    const escapeHtml = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const formatValue = (value) => {
      if (Array.isArray(value)) {
        return value.length
          ? value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
          : "<li>None</li>";
      }

      if (value && typeof value === "object") {
        return Object.entries(value)
          .map(
            ([key, val]) =>
              `<div class="kv"><span>${escapeHtml(key)}</span><strong>${escapeHtml(val)}</strong></div>`
          )
          .join("");
      }

      return escapeHtml(value === "" ? "None" : value);
    };

    const sectionHtml = (section) => {
      const content = section?.content;

      if (content && typeof content === "object" && !Array.isArray(content)) {
        return Object.entries(content)
          .map(([key, value]) => {
            if (value && typeof value === "object" && !Array.isArray(value)) {
              return `
                <div class="sub-block">
                  <h4>${escapeHtml(key)}</h4>
                  ${formatValue(value)}
                </div>
              `;
            }

            if (Array.isArray(value)) {
              return `
                <div class="sub-block">
                  <span>${escapeHtml(key)}</span>
                  <ul>${formatValue(value)}</ul>
                </div>
              `;
            }

            return `
              <div class="kv">
                <span>${escapeHtml(key)}</span>
                <strong>${escapeHtml(value ?? "N/A")}</strong>
              </div>
            `;
          })
          .join("");
      }

      if (Array.isArray(content)) {
        return content.length
          ? `<ul>${formatValue(content)}</ul>`
          : "<p>None</p>";
      }

      return `<p>${escapeHtml(content || "None")}</p>`;
    };

    const sections = reviewPacket.generatedSections || [];
    const warnings = reviewPacket.validationWarnings || [];
    const missing = reviewPacket.missingFields || [];
    const summary = reviewPacket.reviewSummary || {};
    const sample = reviewPacket.judgeReadySample || {};

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>RailSwap Review Packet</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 32px;
              font-family: Arial, Helvetica, sans-serif;
              color: #172033;
              background: #f4f7fb;
            }
            .packet {
              max-width: 900px;
              margin: 0 auto;
              background: #fff;
              border: 1px solid #dce3ef;
              border-radius: 18px;
              overflow: hidden;
            }
            .header {
              padding: 28px 32px;
              border-bottom: 1px solid #dce3ef;
              background: #f8fbff;
            }
            .brand {
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 1.8px;
              text-transform: uppercase;
            }
            h1 { margin: 8px 0 4px; font-size: 28px; }
            .meta { color: #667085; font-size: 13px; }
            .section {
              margin: 22px 28px;
              border: 1px solid #e1e7f0;
              border-radius: 14px;
              overflow: hidden;
            }
            .section h2 {
              margin: 0;
              padding: 14px 16px;
              font-size: 16px;
              background: #f7f9fc;
              border-bottom: 1px solid #e1e7f0;
            }
            .content { padding: 16px; }
            .kv {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 9px 0;
              border-bottom: 1px solid #edf1f6;
            }
            .kv:last-child { border-bottom: 0; }
            .kv span { color: #667085; text-transform: capitalize; }
            .kv strong { text-align: right; }
            .sub-block {
              margin: 10px 0;
              padding: 10px;
              background: #f8fafc;
              border-radius: 10px;
            }
            .sub-block h4 {
              margin: 0 0 8px;
              text-transform: capitalize;
            }
            ul { margin: 8px 0 0 18px; padding: 0; }
            li { margin: 6px 0; }
            .status {
              display: inline-block;
              padding: 6px 10px;
              border-radius: 999px;
              background: #e9f8ef;
              font-weight: 800;
            }
            .notes {
              white-space: pre-wrap;
              line-height: 1.6;
              min-height: 50px;
            }
            .footer {
              padding: 20px 28px 28px;
              color: #667085;
              font-size: 12px;
              text-align: center;
            }
            @media print {
              body { padding: 0; background: #fff; }
              .packet { border: 0; border-radius: 0; max-width: none; }
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <main class="packet">
            <header class="header">
              <div class="brand">RAILSWAP</div>
              <h1>Structured Review Packet</h1>
              <div class="meta">
                Review Packet ID: ${escapeHtml(reviewPacket.reviewPacketId || "N/A")}<br />
                Generated: ${escapeHtml(
                  reviewPacket.generatedAt
                    ? new Date(reviewPacket.generatedAt).toLocaleString()
                    : new Date().toLocaleString()
                )}
              </div>
            </header>

            ${sections
              .map(
                (section) => `
                  <section class="section">
                    <h2>${escapeHtml(section.title || section.type)}</h2>
                    <div class="content">${sectionHtml(section)}</div>
                  </section>
                `
              )
              .join("")}

            <section class="section">
              <h2>Validation Warnings</h2>
              <div class="content">
                ${
                  warnings.length
                    ? `<ul>${formatValue(warnings)}</ul>`
                    : "<p>None</p>"
                }
              </div>
            </section>

            <section class="section">
              <h2>Missing Fields</h2>
              <div class="content">
                ${
                  missing.length
                    ? `<ul>${formatValue(missing)}</ul>`
                    : "<p>None</p>"
                }
              </div>
            </section>

            <section class="section">
              <h2>Review Summary</h2>
              <div class="content">
                ${Object.entries(summary)
                  .map(
                    ([key, value]) => `
                      <div class="kv">
                        <span>${escapeHtml(key)}</span>
                        <strong>${escapeHtml(value ?? "N/A")}</strong>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </section>

            <section class="section">
              <h2>User Notes</h2>
              <div class="content notes">${escapeHtml(
                reviewPacket.userNotes || reviewNotes || "No notes added."
              )}</div>
            </section>

            <section class="section">
              <h2>Judge-Ready Sample</h2>
              <div class="content">
                ${Object.entries(sample)
                  .map(
                    ([key, value]) => `
                      <div class="kv">
                        <span>${escapeHtml(key)}</span>
                        <strong>${escapeHtml(value ?? "N/A")}</strong>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </section>

            <div class="footer">
              RailSwap — AI Powered Railway Seat Exchange & Smart Passenger Assistance System
            </div>
          </main>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 350);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=1000,height=800");

    if (!printWindow) {
      setErrorMsg("Please allow pop-ups in the browser to download the Review Packet.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Filtered Matches
  const filteredMatches = matches.filter((item) => {
    if (coachFilter !== "ALL" && item.coach?.toUpperCase() !== coachFilter.toUpperCase()) {
      return false;
    }
    if (berthFilter !== "ALL" && item.seatType !== berthFilter) {
      return false;
    }
    return true;
  });

  // Categorize Requests for Requester Dashboard
  const requesterPending = requests.filter((r) => r.status === "PENDING");
  const requesterAccepted = requests.filter((r) => r.status === "ACCEPTED" || r.paymentUnlocked);
  const requesterCompleted = requests.filter((r) => r.status === "COMPLETED" || r.status === "PAYMENT_SUCCESSFUL");
  const requesterRejected = requests.filter((r) => r.status === "REJECTED");

  // Categorize Requests for Receiver Dashboard
  const receiverIncoming = requests.filter((r) => r.status === "PENDING");
  const receiverAccepted = requests.filter((r) => r.status === "ACCEPTED" || r.status === "COMPLETED");

  const myRequest = requests.find((item) => item.user === "user123" || item.user === "user") || latestRequest;

  return (
    <div className="seat-container">
      {/* RAILWAY HERO HEADER */}
      <div className="railway-hero">
        <div className="hero-content">
          <span className="hero-badge">INDIAN RAILWAYS SEAT EXCHANGER</span>
          <h1>
            Smart Seat Exchange <span>Module</span>
          </h1>
          <p>
            Post PNR ticket details, select wanted Coach & Seat number, and receive direct passenger match acceptances.
            Give Reward is available ONLY AFTER passenger accepts your request!
          </p>
        </div>

        <div className="hero-train">
          <div className="train-icon">🚆</div>
          <div className="route-line">
            <span>●</span>
            <div></div>
            <span>●</span>
          </div>
          <div className="route-label">
            <span>POST-ACCEPTANCE REWARD</span>
            <strong>Give Reward</strong>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="seat-tabs">
        <button
          className={activeTab === "requester" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("requester")}
        >
          👤 Requester Dashboard ({requests.length})
        </button>
        <button
          className={activeTab === "receiver" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("receiver")}
        >
          📥 Receiver Dashboard ({receiverIncoming.length})
        </button>
        <button
          className={activeTab === "matches" ? "tab-btn active" : "tab-btn"}
          onClick={() => {
            setActiveTab("matches");
            if (latestRequest && matches.length === 0) findMatches();
          }}
        >
          🤖 AI Passenger Matches ({matches.length})
        </button>
        <button
          className={activeTab === "history" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("history")}
        >
          📜 Exchange History
        </button>
        <button
          className={activeTab === "payments" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("payments")}
        >
          💳 Paytm Payment History ({paymentHistory.length})
        </button>
      </div>

      {/* ALERTS */}
      {message && <div className="alert alert-info">{message}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* =======================================
          TAB 1: REQUESTER DASHBOARD
      ======================================= */}
      {activeTab === "requester" && (
        <div className="dashboard-view">
          <div className="top-section">
            {/* REQUEST SEAT SWAP FORM */}
            <div className="preference card-container">
              <div className="form-header">
                <div className="form-icon">🔁</div>
                <div>
                  <h2>Post Seat Exchange Request</h2>
                  <p>PNR ticket details are auto-filled. Select wanted Coach & Seat number.</p>
                </div>
              </div>

              <SeatExchangeForm onSubmit={submitSeatExchange} loading={loading} />
            </div>

            {/* MY ACTIVE REQUEST CARD */}
            <div className="seat-card">
              <span className="section-label">MY ACTIVE TICKET & REQUEST STATUS</span>
              <div className="journey-heading">
                <div>
                  <h2>{myRequest ? myRequest.trainName : "12951 - Rajdhani Express"}</h2>
                  <span>PNR: {myRequest ? myRequest.pnr : "2418593021"}</span>
                </div>
                <span className="verified-badge">✓ PNR Auto-Verified</span>
              </div>

              <div className="current-seat-box">
                <div className="seat-visual">
                  <div className="seat-number">{myRequest ? myRequest.seatNumber : "35"}</div>
                  <span>{myRequest ? myRequest.coach : "B2"}</span>
                </div>
                <div>
                  <h3>Current Seat: {myRequest ? myRequest.seatType : "Middle Berth"}</h3>
                  <p>Wanted Seat: <strong>{myRequest?.preferredSeat || "Coach B2 Seat 12"}</strong></p>
                </div>
                <span className={`status-badge-lg ${myRequest?.status?.toLowerCase() || "pending"}`}>
                  {myRequest ? myRequest.status : "PENDING"}
                </span>
              </div>

              {/* POST-ACCEPTANCE PAYTM PAYMENT UNLOCKED BANNER */}
              {myRequest && (myRequest.status === "ACCEPTED" || myRequest.paymentUnlocked) && !myRequest.donationPaid && (
                <div className="paytm-unlocked-banner">
                  <div className="banner-left">
                    <span className="paytm-logo">Paytm</span>
                    <div>
                      <h4>🎉 Seat Exchange Confirmed!</h4>
                      <p>Passenger accepted your request. Give Reward option is now unlocked.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUnlockedPaymentRequest(myRequest);
                      setShowPaytmModal(true);
                    }}
                    className="paytm-pay-now-btn"
                  >
                    🎁 Give Reward
                  </button>
                </div>
              )}

              <div className="journey-grid">
                <div>
                  <span>BOARDING</span>
                  <strong>{myRequest ? myRequest.boardingStation : "New Delhi (NDLS)"}</strong>
                </div>
                <div>
                  <span>DESTINATION</span>
                  <strong>{myRequest ? myRequest.destinationStation : "Mumbai Central (MMCT)"}</strong>
                </div>
                <div>
                  <span>DATE</span>
                  <strong>{myRequest ? myRequest.journeyDate : "2026-08-15"}</strong>
                </div>
                <div>
                  <span>PAYMENT</span>
                  <strong className={myRequest?.donationPaid ? "text-success" : "text-warning"}>
                    {myRequest?.donationPaid ? "Reward Given ✓" : "Unlocked Post-Acceptance"}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => findMatches()}
                disabled={matchLoading}
                className="find-match-button"
              >
                {matchLoading ? "Searching AI Matches..." : "🔍 Find Matching Passengers"}
              </button>
            </div>
          </div>

          {/* REQUESTER CATEGORIZED LISTS */}
          <div className="dashboard-sections-grid">
            {/* PENDING REQUESTS */}
            <div className="dash-box">
              <h3>⏳ Pending Requests ({requesterPending.length})</h3>
              {requesterPending.length === 0 ? (
                <p className="empty-text">No pending requests.</p>
              ) : (
                requesterPending.map((item) => (
                  <div className="mini-request-card" key={item.id}>
                    <div>
                      <strong>{item.trainName}</strong> ({item.coach}-{item.seatNumber} ➔ {item.preferredSeat})
                      <div className="badge-sub">Status: PENDING (Waiting for Acceptance)</div>
                    </div>
                    <button className="cancel-sm" onClick={() => handleCancel(item.id)}>Cancel</button>
                  </div>
                ))
              )}
            </div>

            {/* ACCEPTED / PAYMENT PENDING */}
            <div className="dash-box highlight-box">
              <h3>🎉 Accepted & Payment Pending ({requesterAccepted.length})</h3>
              {requesterAccepted.length === 0 ? (
                <p className="empty-text">No accepted requests awaiting payment.</p>
              ) : (
                requesterAccepted.map((item) => (
                  <div className="mini-request-card" key={item.id}>
                    <div>
                      <strong>{item.trainName}</strong> — Exchange Confirmed!
                      <div className="badge-sub text-success font-bold">Give Reward Unlocked!</div>
                    </div>
                    <button
                      className="paytm-sm-btn"
                      onClick={() => {
                        setUnlockedPaymentRequest(item);
                        setShowPaytmModal(true);
                      }}
                    >
                      🎁 Give Reward
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* COMPLETED EXCHANGES */}
            <div className="dash-box">
              <h3>✅ Completed Exchanges ({requesterCompleted.length})</h3>
              {requesterCompleted.length === 0 ? (
                <p className="empty-text">No completed exchanges yet.</p>
              ) : (
                requesterCompleted.map((item) => (
                  <div className="mini-request-card" key={item.id}>
                    <div>
                      <strong>{item.passengerName}</strong> ({item.coach}-{item.seatNumber} ➔ {item.preferredSeat})
                      <div className="text-success font-bold">Exchange Completed ✓</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        className="receipt-sm-btn"
                        onClick={() => setSelectedReceipt(item)}
                      >
                        🧾 Receipt
                      </button>
                      <button
                        className="receipt-sm-btn"
                        onClick={() => {
                          setReviewNotes("");
                          setReviewPacket(null);
                          setReviewPacketRequest(item);
                          setActiveTab("history");
                        }}
                      >
                        📄 Review Packet
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* REJECTED REQUESTS */}
            <div className="dash-box">
              <h3>❌ Rejected Requests ({requesterRejected.length})</h3>
              {requesterRejected.length === 0 ? (
                <p className="empty-text">No rejected requests.</p>
              ) : (
                requesterRejected.map((item) => (
                  <div className="mini-request-card" key={item.id}>
                    <div>
                      <strong>{item.passengerName}</strong> ({item.trainName})
                      <div className="text-danger font-bold">Declined by passenger</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          TAB 2: RECEIVER DASHBOARD
      ======================================= */}
      {activeTab === "receiver" && (
        <div className="dashboard-view">
          <div className="section-title">
            <div>
              <span>RECEIVER NOTIFICATION FLOW</span>
              <h2>Incoming Seat Swap Requests ({receiverIncoming.length})</h2>
              <p className="subtext">
                Strictly Accept & Reject options only. Strictly NO chat, messaging, phone calls, or video calls.
              </p>
            </div>
          </div>

          <div className="match-list">
            {receiverIncoming.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📥</div>
                <h3>No Incoming Requests</h3>
                <p>When passengers on your train request to swap seats with you, they will appear here with Accept & Reject options.</p>
              </div>
            ) : (
              receiverIncoming.map((item) => (
                <div className="match-card receiver-card" key={item.id}>
                  <div className="match-left">
                    <div className="avatar">{(item.passengerName || "P").charAt(0)}</div>
                    <div className="details">
                      <div className="passenger-heading">
                        <h3>{item.passengerName}</h3>
                        <span className="verified-passenger">✓ PNR Verified Passenger</span>
                      </div>

                      <p>
                        <strong>Train:</strong> {item.trainName} ({item.trainNumber}) • <strong>Date:</strong> {item.journeyDate}
                      </p>

                      <div className="seat-exchange-row">
                        <div className="mini-seat">
                          <span>THEIR SEAT</span>
                          <strong>{item.coach}-{item.seatNumber}</strong>
                          <small>{item.seatType}</small>
                        </div>
                        <div className="exchange-arrow">➔</div>
                        <div className="mini-seat preferred">
                          <span>WANTED SEAT</span>
                          <strong>{item.preferredSeat}</strong>
                          <small>Requested Swap</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="match-right">
                    <div className="no-chat-notice">🔒 No Chat / Calls Needed</div>
                    <div className="receiver-action-buttons">
                      <button className="accept" onClick={() => handleAccept(item.id, "receiverUser")}>
                        ✓ Accept Swap
                      </button>
                      <button className="reject" onClick={() => handleReject(item.id)}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RECEIVER COMPLETED & REWARDS */}
          <div className="receiver-history-section margin-top-20">
            <h3>🎁 Receiver Reward & Completed Exchanges ({receiverAccepted.length})</h3>
            <div className="payment-table">
              <div className="payment-row header">
                <span>Passenger</span>
                <span>Swapped Seat</span>
                <span>Status</span>
                <span>Reward Escrow</span>
              </div>
              {receiverAccepted.length === 0 ? (
                <div className="payment-row">
                  <span style={{ gridColumn: "span 4", textAlign: "center" }}>No accepted exchanges yet.</span>
                </div>
              ) : (
                receiverAccepted.map((r) => (
                  <div className="payment-row" key={r.id}>
                    <strong>{r.passengerName}</strong>
                    <span>{r.coach}-{r.seatNumber} ➔ {r.preferredSeat}</span>
                    <span className="status-success">✓ {r.status}</span>
                    <span className="amount text-success">+ Reward Escrow</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          TAB 3: AI PASSENGER MATCHES
      ======================================= */}
      {activeTab === "matches" && (
        <div className="match-section">
          <div className="section-title">
            <div>
              <span>AI RECOMMENDED SWAPS</span>
              <h2>Matching Passengers ({filteredMatches.length})</h2>
            </div>

            <div className="filter-controls">
              <select value={coachFilter} onChange={(e) => setCoachFilter(e.target.value)}>
                <option value="ALL">All Coaches</option>
                <option value="B2">Coach B2</option>
                <option value="S3">Coach S3</option>
                <option value="A1">Coach A1</option>
              </select>

              <select value={berthFilter} onChange={(e) => setBerthFilter(e.target.value)}>
                <option value="ALL">All Berth Types</option>
                <option value="Lower Berth">Lower Berth</option>
                <option value="Middle Berth">Middle Berth</option>
                <option value="Upper Berth">Upper Berth</option>
              </select>
            </div>
          </div>

          {matchLoading && <div className="loading-state">Finding compatible passengers using AI match scoring...</div>}

          {!matchLoading && filteredMatches.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Matches Found Currently</h3>
              <p>Post a request to auto-match passengers on your train.</p>
            </div>
          )}

          {!matchLoading &&
            filteredMatches.map((item) => (
              <div className="match-card" key={item.id}>
                <div className="match-left">
                  <div className="avatar">{(item.passengerName || "P").charAt(0)}</div>

                  <div className="details">
                    <div className="passenger-heading">
                      <h3>{item.passengerName}</h3>
                      <span className="verified-passenger">✓ Verified PNR Ticket</span>
                    </div>

                    <p>
                      <strong>Age/Gender:</strong> {item.age} yrs • {item.gender}
                    </p>

                    <div className="seat-exchange-row">
                      <div className="mini-seat">
                        <span>CURRENT SEAT</span>
                        <strong>{item.coach}-{item.seatNumber}</strong>
                        <small>{item.seatType}</small>
                      </div>

                      <div className="exchange-arrow">➔</div>

                      <div className="mini-seat preferred">
                        <span>WANTED SEAT</span>
                        <strong>{item.preferredSeat}</strong>
                        <small>Preferred</small>
                      </div>
                    </div>

                    <div className="ai-tags-container">
                      {(item.aiRecommendations || ["Recommend Same Coach First", "Highest Success Probability"]).map(
                        (tag, idx) => (
                          <span className="ai-tag" key={idx}>
                            ✨ {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="match-right">
                  <div className="match-score">
                    <span>AI MATCH SCORE</span>
                    <strong>{item.matchPercentage || 95}% Match</strong>
                  </div>

                  {item.status === "ACCEPTED" ? (
                    <div className="accepted-status-badge">✓ ACCEPTED & UNLOCKED</div>
                  ) : (
                    <div className="buttons">
                      <button className="accept" onClick={() => handleAccept(item.id, item.user)}>
                        Accept Swap
                      </button>
                      <button className="reject" onClick={() => handleReject(item.id)}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* =======================================
          TAB 4: EXCHANGE HISTORY
      ======================================= */}
      {activeTab === "history" && (
        <div className="match-section">
          <h2>Complete Seat Exchange History</h2>

          {requests.length === 0 ? (
            <div className="empty-state">
              <h3>No Exchange History</h3>
            </div>
          ) : (
            requests.map((item) => (
              <div className="match-card" key={item.id}>
                <div className="match-left">
                  <div className="avatar">{(item.passengerName || "P").charAt(0)}</div>
                  <div className="details">
                    <h3>{item.passengerName}</h3>
                    <p>
                      <strong>Train:</strong> {item.trainName} ({item.trainNumber}) • <strong>PNR:</strong> {item.pnr}
                    </p>
                    <p>
                      <strong>Seat:</strong> {item.coach}-{item.seatNumber} ({item.seatType}) ➔ <strong>Wanted:</strong> {item.preferredSeat}
                    </p>
                  </div>
                </div>

                <div className="match-right">
                  <span className={`status-badge-lg ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>

                  {(item.status === "COMPLETED" || item.status === "ACCEPTED") && (
                    <button className="view-receipt-btn" onClick={() => setSelectedReceipt(item)}>
                      🧾 View Receipt
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =======================================
          TAB 5: PAYTM PAYMENT HISTORY
      ======================================= */}
      {activeTab === "payments" && (
        <div className="match-section">
          <h2>Reward & Transaction History</h2>
          <p className="subtext">Logs for post-acceptance reward transactions and escrow transfers.</p>

          <div className="payment-table">
            <div className="payment-row header">
              <span>Transaction ID</span>
              <span>Payment Provider</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {paymentHistory.length === 0 ? (
              <div className="payment-row">
                <span style={{ gridColumn: "span 5", textAlign: "center" }}>No payment transactions recorded yet.</span>
              </div>
            ) : (
              paymentHistory.map((tx) => (
                <div className="payment-row" key={tx.id}>
                  <strong className="tx-id">{tx.transactionId}</strong>
                  <span className="paytm-badge">Reward Gateway</span>
                  <span>{tx.type}</span>
                  <span className="amount">₹{tx.amount || 50}</span>
                  <span className="status-success">✓ {tx.status || "SUCCESS"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =======================================
          MODAL 1: PAYTM POST-ACCEPTANCE PAYMENT MODAL
      ======================================= */}
      {showPaytmModal && unlockedPaymentRequest && (
        <div className="modal-backdrop">
          <div className="modal-card paytm-modal-card">
            <div className="paytm-modal-header">
              <div className="paytm-branding">
                <span className="paytm-logo-text">Paytm</span>
                <span className="paytm-sub-text">POST-ACCEPTANCE PAYMENT</span>
              </div>
              <button className="close-btn" onClick={() => setShowPaytmModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="confirmed-swap-badge">
                🎉 Passenger Accepted Your Seat Swap Request!
              </div>

              <div className="swap-details-box">
                <div>
                  <span>Passenger:</span> <strong>{unlockedPaymentRequest.passengerName}</strong>
                </div>
                <div>
                  <span>Assigned Seat:</span> <strong>Coach {unlockedPaymentRequest.coach} Seat #{unlockedPaymentRequest.seatNumber}</strong>
                </div>
                <div>
                  <span>Exchanged Seat:</span> <strong>{unlockedPaymentRequest.preferredSeat}</strong>
                </div>
              </div>

              <div className="paytm-amount-box">
                <span>Reward Amount</span>
                <h2>₹50.00</h2>
                <small>Reward & Escrow</small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="paytm-confirm-btn"
                onClick={handlePaytmPayment}
                disabled={processingPaytm}
              >
                {processingPaytm ? "Processing Paytm Payment..." : "🎁 Give Reward"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          MODAL 2: STRUCTURED REVIEW PACKET
      ======================================= */}
      {reviewPacketRequest && (
        <div className="modal-backdrop">
          <div className="modal-card receipt-card" style={{ maxWidth: "980px", width: "96%" }}>
            <div className="modal-header">
              <div>
                <h2>Structured Review Packet</h2>
                <p className="subtext" style={{ margin: "4px 0 0" }}>
                  Generate a complete judge-ready review packet for this completed exchange.
                </p>
              </div>
              <button
                className="close-btn"
                onClick={() => {
                  setReviewPacketRequest(null);
                  setReviewPacket(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {!reviewPacket && (
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}>
                    User Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add reviewer notes, passenger notes, validation observations, or any important information..."
                    rows={5}
                    style={{
                      width: "100%",
                      resize: "vertical",
                      padding: "12px",
                      border: "1px solid #d8dee9",
                      borderRadius: "10px",
                      fontFamily: "inherit",
                    }}
                  />

                  <div className="swap-details-box" style={{ marginTop: "16px" }}>
                    <div>
                      <span>Passenger:</span>{" "}
                      <strong>{reviewPacketRequest.passengerName || "N/A"}</strong>
                    </div>
                    <div>
                      <span>PNR:</span>{" "}
                      <strong>{reviewPacketRequest.pnr || "N/A"}</strong>
                    </div>
                    <div>
                      <span>Train:</span>{" "}
                      <strong>
                        {reviewPacketRequest.trainName || "N/A"} ({reviewPacketRequest.trainNumber || "N/A"})
                      </strong>
                    </div>
                    <div>
                      <span>Status:</span>{" "}
                      <strong>{reviewPacketRequest.status || "N/A"}</strong>
                    </div>
                  </div>

                  <button
                    className="paytm-confirm-btn"
                    onClick={() => handleGenerateReviewPacket(reviewPacketRequest)}
                    disabled={reviewLoading}
                    style={{ marginTop: "16px", width: "100%" }}
                  >
                    {reviewLoading ? "Generating Review Packet..." : "📄 Generate Review Packet"}
                  </button>
                </div>
              )}

              {reviewPacket && (
                <div className="printable-receipt">
                  <div className="receipt-hero">
                    <div className="rail-logo">📄 RAILSWAP REVIEW PACKET</div>
                    <span>{reviewPacket.reviewPacketId || "REVIEW PACKET"}</span>
                  </div>

                  <div className="seat-transition-box">
                    <div className="old-seat">
                      <span>STATUS</span>
                      <h3>{reviewPacket.status || "READY"}</h3>
                      <small>Review Packet</small>
                    </div>

                    <div className="transition-arrow">✓</div>

                    <div className="new-seat">
                      <span>EXCHANGE</span>
                      <h3>{reviewPacketRequest.status}</h3>
                      <small>Completed</small>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {(reviewPacket.generatedSections || []).map((section, index) => (
                      <div
                        key={`${section.type}-${index}`}
                        style={{
                          border: "1px solid #e1e7ef",
                          borderRadius: "12px",
                          padding: "14px",
                          background: "#fff",
                        }}
                      >
                        <h3 style={{ margin: "0 0 10px" }}>
                          {section.title || section.type}
                        </h3>

                        {Array.isArray(section.content) ? (
                          section.content.length ? (
                            <ul style={{ margin: 0, paddingLeft: "20px" }}>
                              {section.content.map((value, i) => (
                                <li key={i}>{String(value)}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>None</p>
                          )
                        ) : section.content && typeof section.content === "object" ? (
                          Object.entries(section.content).map(([key, value]) => (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "20px",
                                padding: "8px 0",
                                borderBottom: "1px solid #edf1f5",
                              }}
                            >
                              <span style={{ color: "#667085" }}>
                                {key.replace(/([A-Z])/g, " $1")}
                              </span>
                              <strong style={{ textAlign: "right" }}>
                                {Array.isArray(value)
                                  ? value.join(", ") || "None"
                                  : typeof value === "object" && value !== null
                                  ? JSON.stringify(value)
                                  : String(value ?? "N/A")}
                              </strong>
                            </div>
                          ))
                        ) : (
                          <p style={{ margin: 0 }}>{String(section.content || "None")}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h3>Validation Warnings</h3>
                    {(reviewPacket.validationWarnings || []).length ? (
                      <ul>
                        {reviewPacket.validationWarnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>None</p>
                    )}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h3>Missing Fields</h3>
                    {(reviewPacket.missingFields || []).length ? (
                      <ul>
                        {reviewPacket.missingFields.map((field, index) => (
                          <li key={index}>{field}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>None</p>
                    )}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h3>Review Summary</h3>
                    {Object.entries(reviewPacket.reviewSummary || {}).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: "1px solid #edf1f5",
                        }}
                      >
                        <span style={{ color: "#667085" }}>
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <strong>{String(value ?? "N/A")}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h3>User Notes</h3>
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {reviewPacket.userNotes || "No notes added."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {reviewPacket && (
                <>
                  <button
                    className="confirm-pay-btn"
                    onClick={handleDownloadReviewPacket}
                  >
                    ⬇ Download Review Packet
                  </button>
                  <button
                    className="close-btn"
                    onClick={() => {
                      setReviewPacketRequest(null);
                      setReviewPacket(null);
                    }}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          MODAL 3: OFFICIAL SEAT EXCHANGE RECEIPT
      ======================================= */}
      {selectedReceipt && (
        <div className="modal-backdrop">
          <div className="modal-card receipt-card">
            <div className="modal-header">
              <h2>Official Seat Exchange Receipt</h2>
              <button className="close-btn" onClick={() => setSelectedReceipt(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body printable-receipt">
              <div className="receipt-hero">
                <div className="rail-logo">🚆 RAILSWAP OFFICIAL RECEIPT</div>
                <span>TXN: {selectedReceipt.transactionId || "PAYTM_8920194"}</span>
              </div>

              <div className="seat-transition-box">
                <div className="old-seat">
                  <span>OLD SEAT</span>
                  <h3>{selectedReceipt.coach}-{selectedReceipt.seatNumber}</h3>
                  <small>{selectedReceipt.seatType}</small>
                </div>

                <div className="transition-arrow">➔</div>

                <div className="new-seat">
                  <span>NEW SEAT</span>
                  <h3>{selectedReceipt.preferredSeat}</h3>
                  <small>Exchanged</small>
                </div>
              </div>

              <div className="receipt-details">
                <div>
                  <span>Passenger:</span> <strong>{selectedReceipt.passengerName}</strong>
                </div>
                <div>
                  <span>PNR:</span> <strong>{selectedReceipt.pnr}</strong>
                </div>
                <div>
                  <span>Train:</span> <strong>{selectedReceipt.trainName} ({selectedReceipt.trainNumber})</strong>
                </div>
                <div>
                  <span>Status:</span> <strong className="green-text">EXCHANGE COMPLETED ✓</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="confirm-pay-btn" onClick={() => window.print()}>
                🖨️ Print / Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatExchange;