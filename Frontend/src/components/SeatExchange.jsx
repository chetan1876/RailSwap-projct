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

  // Filter State
  const [coachFilter, setCoachFilter] = useState("ALL");
  const [berthFilter, setBerthFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'

  // Editable Notes & Status Tag State
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatusTag, setEditStatusTag] = useState("PENDING");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

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

      setMessage("🎉 Seat Exchange Confirmed! Paytm Payment Screen has been unlocked for the requester.");

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
  // REQUESTER PAYS ₹50 VIA PAYTM AFTER ACCEPTANCE
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

      setMessage(`✅ Paytm Payment of ₹50 Successful! (Txn ID: ${res.transactionId}). Exchange Completed!`);
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
  // EDIT RECORD NOTES & STATUS / TAG
  // =====================================================
  const handleStartEditRecord = (item) => {
    const target = item || myRequest || { id: "default_req" };
    const targetId = target.id || "default_req";
    setEditingRecordId(targetId);
    setEditNotes(target.notes || "Passenger requested a lower berth for the journey.");
    setEditStatusTag(target.status || "PENDING");
    setEditSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditingRecordId(null);
    setEditSuccessMsg("");
  };

  const handleSaveChanges = (recordId) => {
    const targetId = recordId || editingRecordId || (myRequest ? myRequest.id : "default_req");

    // Update in requests list state
    setRequests((prev) => {
      const exists = prev.some((r) => r.id === targetId || (!r.id && targetId === "default_req"));
      if (!exists && myRequest) {
        return [{ ...myRequest, notes: editNotes, status: editStatusTag }, ...prev];
      }
      return prev.map((r) =>
        r.id === targetId || (!r.id && targetId === "default_req")
          ? { ...r, notes: editNotes, status: editStatusTag }
          : r
      );
    });

    // Update latestRequest / myRequest state
    if (!myRequest || myRequest.id === targetId || targetId === "default_req") {
      setLatestRequest((prev) => ({
        ...(prev || {
          pnr: "2418593021",
          trainName: "12951 - Rajdhani Express",
          trainNumber: "12951",
          coach: "B2",
          seatNumber: 35,
          seatType: "Middle Berth",
          preferredSeat: "Coach A1 Seat 6",
          boardingStation: "New Delhi (NDLS)",
          destinationStation: "Mumbai Central (MMCT)",
          journeyDate: "2026-08-15"
        }),
        notes: editNotes,
        status: editStatusTag,
      }));
    }

    // Update matches list state
    setMatches((prev) =>
      prev.map((r) =>
        r.id === targetId ? { ...r, notes: editNotes, status: editStatusTag } : r
      )
    );

    setEditSuccessMsg("✓ Record Notes & Status saved successfully!");
    setEditingRecordId(null);
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

  // Status filter helper function
  const matchesStatusFilter = (itemStatus) => {
    if (statusFilter === "ALL") return true;
    const statusUpper = (itemStatus || "").toUpperCase();
    const filterUpper = statusFilter.toUpperCase();

    if (filterUpper === "PENDING") return statusUpper === "PENDING";
    if (filterUpper === "ACCEPTED") return statusUpper === "ACCEPTED" || statusUpper === "PAYMENT_PENDING";
    if (filterUpper === "COMPLETED") return statusUpper === "COMPLETED" || statusUpper === "PAYMENT_SUCCESSFUL";
    if (filterUpper === "REJECTED") return statusUpper === "REJECTED";
    if (filterUpper === "CANCELLED") return statusUpper === "CANCELLED" || statusUpper === "CANCELLED_BY_USER";

    return statusUpper === filterUpper;
  };

  // Categorize Requests for Requester Dashboard (Role-Aware Filtered)
  const requesterPending = requests.filter((r) => r.status === "PENDING" && matchesStatusFilter(r.status));
  const requesterAccepted = requests.filter((r) => (r.status === "ACCEPTED" || r.paymentUnlocked) && matchesStatusFilter(r.status));
  const requesterCompleted = requests.filter((r) => (r.status === "COMPLETED" || r.status === "PAYMENT_SUCCESSFUL") && matchesStatusFilter(r.status));
  const requesterRejected = requests.filter((r) => r.status === "REJECTED" && matchesStatusFilter(r.status));
  const requesterCancelled = requests.filter((r) => (r.status === "CANCELLED" || r.status === "CANCELLED_BY_USER") && matchesStatusFilter(r.status));

  // Categorize Requests for Receiver Dashboard (Role-Aware Filtered)
  const receiverIncoming = requests.filter((r) => r.status === "PENDING" && matchesStatusFilter(r.status));
  const receiverAccepted = requests.filter((r) => (r.status === "ACCEPTED" || r.status === "COMPLETED") && matchesStatusFilter(r.status));

  // History Requests (Role-Aware Filtered)
  const historyRequests = requests.filter((r) => matchesStatusFilter(r.status));

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
            Paytm ₹50 payment unlocks ONLY AFTER passenger accepts your request!
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
            <span>POST-ACCEPTANCE PAYMENT</span>
            <strong>Paytm ₹50 Platform Fee</strong>
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

              {/* RECORD NOTES & STATUS / TAG DETAIL VIEW & EDITOR */}
              <div className="seat-notes-display" style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px dashed #cbd5e1" }}>
                {editSuccessMsg && (
                  <div style={{ padding: "8px 12px", background: "#dcfce7", color: "#15803d", borderRadius: "8px", fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>
                    {editSuccessMsg}
                  </div>
                )}

                {editingRecordId === (myRequest?.id || "default_req") ? (
                  <div className="record-edit-form" style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>Edit Record Notes & Status / Tag</h4>

                    {/* STATUS / TAG SELECTOR */}
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>
                        Status / Tag
                      </label>
                      <select
                        value={editStatusTag}
                        onChange={(e) => setEditStatusTag(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1e293b",
                          backgroundColor: "#ffffff",
                          outline: "none"
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    {/* EDITABLE NOTES FIELD */}
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>
                        Notes
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Enter notes..."
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          resize: "vertical",
                          outline: "none"
                        }}
                      />
                    </div>

                    {/* FORM ACTION BUTTONS */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => handleSaveChanges(myRequest?.id || "default_req")}
                        style={{
                          padding: "8px 16px",
                          background: "#0b5cad",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditNotes("")}
                        style={{
                          padding: "8px 12px",
                          background: "#e2e8f0",
                          color: "#475569",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Clear Notes
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{
                          padding: "8px 12px",
                          background: "transparent",
                          color: "#64748b",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "13px", color: "#475569" }}>Notes:</strong>
                      <button
                        type="button"
                        onClick={() => handleStartEditRecord(myRequest)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0b5cad",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "2px 6px"
                        }}
                      >
                        ✏️ Edit Notes & Status
                      </button>
                    </div>

                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#1e293b", fontWeight: "500" }}>
                      {myRequest?.notes || "Passenger requested a lower berth for the journey."}
                    </p>
                  </div>
                )}
              </div>

              {/* POST-ACCEPTANCE PAYTM PAYMENT UNLOCKED BANNER */}
              {myRequest && (myRequest.status === "ACCEPTED" || myRequest.paymentUnlocked) && !myRequest.donationPaid && (
                <div className="paytm-unlocked-banner">
                  <div className="banner-left">
                    <span className="paytm-logo">Paytm</span>
                    <div>
                      <h4>🎉 Seat Exchange Confirmed!</h4>
                      <p>Passenger accepted your request. Paytm Payment Screen is now unlocked.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUnlockedPaymentRequest(myRequest);
                      setShowPaytmModal(true);
                    }}
                    className="paytm-pay-now-btn"
                  >
                    Pay Paytm ₹50 Now
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
                    {myRequest?.donationPaid ? "₹50 Paid ✓" : "Unlocked Post-Acceptance"}
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

          {/* ROLE-AWARE RECORD FILTER */}
          <div className="record-filter-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 15px 0", padding: "14px 20px", background: "white", border: "1px solid #e4eaf1", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#172033" }}>Seat Exchange Records</h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Requester Role Status Filter</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="seat-status-filter" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Filter:</label>
              <select
                id="seat-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1e293b",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="ALL">All Records</option>
                <option value="PENDING">Pending Requests</option>
                <option value="ACCEPTED">Accepted Requests</option>
                <option value="REJECTED">Rejected Requests</option>
                <option value="COMPLETED">Completed Requests</option>
                <option value="CANCELLED">Cancelled Requests</option>
              </select>
            </div>
          </div>

          {/* REQUESTER CATEGORIZED LISTS */}
          <div className="dashboard-sections-grid">
            {/* PENDING REQUESTS */}
            {(statusFilter === "ALL" || statusFilter === "PENDING") && (
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
                        <div style={{ marginTop: "6px", fontSize: "13px", color: "#475569" }}>
                          <strong>Notes:</strong> {item.notes || "Passenger requested a lower berth for the journey."}
                        </div>
                      </div>
                      <button className="cancel-sm" onClick={() => handleCancel(item.id)}>Cancel</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ACCEPTED / PAYMENT PENDING */}
            {(statusFilter === "ALL" || statusFilter === "ACCEPTED") && (
              <div className="dash-box highlight-box">
                <h3>🎉 Accepted & Payment Pending ({requesterAccepted.length})</h3>
                {requesterAccepted.length === 0 ? (
                  <p className="empty-text">No accepted requests awaiting payment.</p>
                ) : (
                  requesterAccepted.map((item) => (
                    <div className="mini-request-card" key={item.id}>
                      <div>
                        <strong>{item.trainName}</strong> — Exchange Confirmed!
                        <div className="badge-sub text-success font-bold">Paytm Payment Screen Unlocked!</div>
                        <div style={{ marginTop: "6px", fontSize: "13px", color: "#475569" }}>
                          <strong>Notes:</strong> {item.notes || "Passenger requested a lower berth for the journey."}
                        </div>
                      </div>
                      <button
                        className="paytm-sm-btn"
                        onClick={() => {
                          setUnlockedPaymentRequest(item);
                          setShowPaytmModal(true);
                        }}
                      >
                        Pay Paytm ₹50
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* COMPLETED EXCHANGES */}
            {(statusFilter === "ALL" || statusFilter === "COMPLETED") && (
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
                      <button className="receipt-sm-btn" onClick={() => setSelectedReceipt(item)}>Receipt</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* REJECTED REQUESTS */}
            {(statusFilter === "ALL" || statusFilter === "REJECTED") && (
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
            )}

            {/* CANCELLED REQUESTS */}
            {(statusFilter === "ALL" || statusFilter === "CANCELLED") && (
              <div className="dash-box">
                <h3>🚫 Cancelled Requests ({requesterCancelled.length})</h3>
                {requesterCancelled.length === 0 ? (
                  <p className="empty-text">No cancelled requests.</p>
                ) : (
                  requesterCancelled.map((item) => (
                    <div className="mini-request-card" key={item.id}>
                      <div>
                        <strong>{item.passengerName || item.trainName}</strong> ({item.coach || "B2"}-{item.seatNumber || "35"})
                        <div className="text-danger font-bold">Request Cancelled</div>
                        <div style={{ marginTop: "6px", fontSize: "13px", color: "#475569" }}>
                          <strong>Notes:</strong> {item.notes || "Passenger requested a lower berth for the journey."}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
              <label htmlFor="seat-status-filter-receiver" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Filter Status:</label>
              <select
                id="seat-status-filter-receiver"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1e293b",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Requests</option>
                <option value="ACCEPTED">Accepted Requests</option>
                <option value="REJECTED">Rejected Requests</option>
                <option value="COMPLETED">Completed Requests</option>
                <option value="CANCELLED">Cancelled Requests</option>
              </select>
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

                      <div style={{ marginTop: "10px", fontSize: "13px", color: "#475569" }}>
                        <strong>Notes:</strong>
                        <p style={{ margin: "2px 0 0 0", color: "#334155" }}>{item.notes || "Passenger requested a lower berth for the journey."}</p>
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
                    <span className="amount text-success">+₹50 Escrow Reward</span>
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

                    <div style={{ marginTop: "10px", fontSize: "13px", color: "#475569" }}>
                      <strong>Notes:</strong>
                      <p style={{ margin: "2px 0 0 0", color: "#334155" }}>{item.notes || "Passenger requested a lower berth for the journey."}</p>
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
          <div className="record-filter-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", padding: "14px 20px", background: "white", border: "1px solid #e4eaf1", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#172033" }}>Complete Seat Exchange History</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Role-Aware Status Filter</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="seat-status-filter-history" style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Filter Status:</label>
              <select
                id="seat-status-filter-history"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1e293b",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="ALL">All Records</option>
                <option value="PENDING">Pending Requests</option>
                <option value="ACCEPTED">Accepted Requests</option>
                <option value="REJECTED">Rejected Requests</option>
                <option value="COMPLETED">Completed Requests</option>
                <option value="CANCELLED">Cancelled Requests</option>
              </select>
            </div>
          </div>

          {historyRequests.length === 0 ? (
            <div className="empty-state">
              <h3>No Exchange History for selected status</h3>
            </div>
          ) : (
            historyRequests.map((item) => (
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
                    <div style={{ marginTop: "6px", fontSize: "13px", color: "#475569" }}>
                      <strong>Notes:</strong> {item.notes || "Passenger requested a lower berth for the journey."}
                    </div>
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
          <h2>Paytm Payment & Transaction History</h2>
          <p className="subtext">Logs for ₹50 post-acceptance Paytm transactions and escrow transfers.</p>

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
                  <span className="paytm-badge">Paytm Gateway</span>
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
                <span>Total Amount to Pay</span>
                <h2>₹50.00</h2>
                <small>Platform Fee & Reward Escrow</small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="paytm-confirm-btn"
                onClick={handlePaytmPayment}
                disabled={processingPaytm}
              >
                {processingPaytm ? "Processing Paytm Payment..." : "Pay ₹50 via Paytm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          MODAL 2: OFFICIAL SEAT EXCHANGE RECEIPT
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

export default SeatExchange ;