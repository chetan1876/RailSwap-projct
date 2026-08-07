import { useState, useEffect } from "react";
import {
  verifyPNRForLostItem,
  reportLostItem,
  getMyLostItems,
  updateLostItemStatus,
} from "../services/lostItem.service";
import "../styles/lostItemAI.css";

const CATEGORIES = [
  "Mobile",
  "Wallet",
  "Bag",
  "Laptop",
  "Jewellery",
  "Documents",
  "Watch",
  "Other",
];

const LostItemAI = () => {
  const [activeTab, setActiveTab] = useState("report"); // 'report' | 'my-items'

  // Step 1 & 2: PNR Verification State
  const [pnrInput, setPnrInput] = useState("");
  const [isVerifyingPnr, setIsVerifyingPnr] = useState(false);
  const [pnrVerified, setPnrVerified] = useState(false);
  const [journeyData, setJourneyData] = useState(null);

  // Form Fields State (Step 3)
  const [itemCategory, setItemCategory] = useState("Mobile");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [lostLocation, setLostLocation] = useState("");
  const [approximateTime, setApproximateTime] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Photo state (Step 8)
  const [photoPreview, setPhotoPreview] = useState(null);

  // Status & Feedback UI (Step 10)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // My Lost Items State (Step 5)
  const [myItems, setMyItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    setIsLoadingItems(true);
    try {
      const res = await getMyLostItems();
      if (res && res.success && Array.isArray(res.data)) {
        setMyItems(res.data);
      }
    } catch (err) {
      console.error("Error fetching my lost items:", err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Step 1 & 2: Fetch Journey Details
  const handleFetchJourneyDetails = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!pnrInput.trim()) {
      setErrorMessage("Please enter a valid PNR number.");
      return;
    }

    setIsVerifyingPnr(true);
    setPnrVerified(false);
    setJourneyData(null);

    try {
      const res = await verifyPNRForLostItem(pnrInput.trim());
      if (res.success) {
        setJourneyData(res);
        setPnrVerified(true);
        setSuccessMessage("PNR Verified successfully! Please fill out the item details below.");
      } else {
        setErrorMessage(res.message || "Invalid PNR Number.");
      }
    } catch (err) {
      console.error("PNR verification failed:", err);
      const apiMsg = err.response?.data?.message || err.message;
      if (apiMsg && apiMsg.includes("Journey not found")) {
        setErrorMessage("Journey not found.");
      } else {
        setErrorMessage("Invalid PNR Number.");
      }
    } finally {
      setIsVerifyingPnr(false);
    }
  };

  // Step 8: Handle Photo Upload with Preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form helper
  const resetForm = () => {
    setPnrInput("");
    setPnrVerified(false);
    setJourneyData(null);
    setItemCategory("Mobile");
    setItemName("");
    setItemDescription("");
    setLostLocation("");
    setApproximateTime("");
    setRewardAmount("");
    setContactNumber("");
    setPhotoPreview(null);
  };

  // Step 3 & 4: Submit Lost Item Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Step 7: Validation
    if (!pnrVerified || !journeyData) {
      setErrorMessage("Please verify your PNR first.");
      return;
    }

    if (!itemName.trim()) {
      setErrorMessage("Item Name is required.");
      return;
    }

    if (!lostLocation.trim()) {
      setErrorMessage("Lost Location is required.");
      return;
    }

    if (!contactNumber.trim()) {
      setErrorMessage("Contact Number is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        pnr: journeyData.pnr,
        passengerName: journeyData.passengerName,
        trainNumber: journeyData.trainNumber,
        trainName: journeyData.trainName,
        from: journeyData.from,
        to: journeyData.to,
        journeyDate: journeyData.journeyDate,
        coach: journeyData.coach,
        seat: journeyData.seat,
        class: journeyData.class,
        itemCategory,
        itemName: itemName.trim(),
        itemDescription: itemDescription.trim(),
        lostLocation: lostLocation.trim(),
        approximateTime,
        photo: photoPreview,
        rewardAmount: rewardAmount ? Number(rewardAmount) : 0,
        contactNumber: contactNumber.trim(),
      };

      const res = await reportLostItem(payload);
      if (res.success) {
        setSuccessMessage("Lost Item Report submitted successfully!");
        resetForm();
        fetchMyItems();
        setActiveTab("my-items");
      } else {
        setErrorMessage(res.message || "Failed to submit lost item report.");
      }
    } catch (err) {
      console.error("Report submit error:", err);
      setErrorMessage(err.response?.data?.message || err.message || "Failed to submit lost item report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 6: Status Flow Progression
  const handleUpdateStatus = async (id, nextStatus) => {
    setUpdatingItemId(id);
    try {
      const res = await updateLostItemStatus(id, nextStatus);
      if (res.success) {
        setMyItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, status: nextStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge status-pending";
      case "Found":
        return "status-badge status-found";
      case "Verified":
        return "status-badge status-verified";
      case "Returned":
        return "status-badge status-returned";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="lost-page">
      {/* Header */}
      <div className="lost-header">
        <div>
          <h1>🧳 Railway Lost & Found System</h1>
          <p>Report lost belongings using your PNR journey details and track recovery status.</p>
        </div>

        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "report" ? "active" : ""}`}
            onClick={() => setActiveTab("report")}
          >
            <i className="fa-solid fa-plus-circle"></i> Report Lost Item
          </button>
          <button
            className={`tab-btn ${activeTab === "my-items" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("my-items");
              fetchMyItems();
            }}
          >
            <i className="fa-solid fa-list-check"></i> My Lost Items ({myItems.length})
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="alert alert-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{errorMessage}</span>
          <button className="close-alert" onClick={() => setErrorMessage("")}>&times;</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <i className="fa-solid fa-circle-check"></i>
          <span>{successMessage}</span>
          <button className="close-alert" onClick={() => setSuccessMessage("")}>&times;</button>
        </div>
      )}

      {/* TAB 1: REPORT LOST ITEM */}
      {activeTab === "report" && (
        <div className="lost-container">
          {/* STEP 1: PNR Verification Card */}
          <div className="pnr-card">
            <div className="pnr-card-header">
              <h2><i className="fa-solid fa-ticket"></i> Step 1: Verify Journey Details</h2>
              <p>Enter your 10-digit PNR number to fetch your train and seat details.</p>
            </div>

            <form onSubmit={handleFetchJourneyDetails} className="pnr-form">
              <div className="pnr-input-group">
                <input
                  type="text"
                  placeholder="Enter 10-Digit PNR Number (e.g. 6504791510)"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  className="rounded-input"
                  maxLength={10}
                  disabled={isVerifyingPnr}
                />
                <button
                  type="submit"
                  className="btn-primary pnr-btn"
                  disabled={isVerifyingPnr}
                >
                  {isVerifyingPnr ? (
                    <>
                      <span className="spinner"></span> Verifying...
                    </>
                  ) : (
                    "Fetch Journey Details"
                  )}
                </button>
              </div>
            </form>

            {/* STEP 2: Read-Only Journey Details */}
            {pnrVerified && journeyData && (
              <div className="journey-details-box fade-in">
                <h3><i className="fa-solid fa-train"></i> Auto-Filled Journey Details (Read-Only)</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Passenger Name</label>
                    <input type="text" value={journeyData.passengerName} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Train Number</label>
                    <input type="text" value={journeyData.trainNumber} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Train Name</label>
                    <input type="text" value={journeyData.trainName} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Boarding Station</label>
                    <input type="text" value={journeyData.from} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Destination Station</label>
                    <input type="text" value={journeyData.to} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Journey Date</label>
                    <input type="text" value={journeyData.journeyDate} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Coach</label>
                    <input type="text" value={journeyData.coach} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Seat Number</label>
                    <input type="text" value={journeyData.seat} readOnly disabled />
                  </div>
                  <div className="detail-item">
                    <label>Class</label>
                    <input type="text" value={journeyData.class} readOnly disabled />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Lost Item Form */}
          {pnrVerified && journeyData && (
            <div className="form-card fade-in">
              <h2><i className="fa-solid fa-box-open"></i> Step 2: Lost Item Information</h2>
              <form onSubmit={handleSubmitReport} className="lost-item-form">
                <div className="form-grid">
                  {/* Category */}
                  <div className="form-group">
                    <label className="required">Item Category</label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="rounded-input"
                      required
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="form-group">
                    <label className="required">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Black Leather Wallet / iPhone 14"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="rounded-input"
                      required
                    />
                  </div>

                  {/* Lost Location */}
                  <div className="form-group">
                    <label className="required">Lost Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Under Seat 25 / Near Washroom / Berth"
                      value={lostLocation}
                      onChange={(e) => setLostLocation(e.target.value)}
                      className="rounded-input"
                      required
                    />
                  </div>

                  {/* Auto-selected Coach */}
                  <div className="form-group">
                    <label>Coach (Auto Selected)</label>
                    <input
                      type="text"
                      value={journeyData.coach}
                      readOnly
                      disabled
                      className="rounded-input readonly-input"
                    />
                  </div>

                  {/* Auto-selected Seat Number */}
                  <div className="form-group">
                    <label>Seat Number (Auto Selected)</label>
                    <input
                      type="text"
                      value={journeyData.seat}
                      readOnly
                      disabled
                      className="rounded-input readonly-input"
                    />
                  </div>

                  {/* Approximate Lost Time */}
                  <div className="form-group">
                    <label>Approximate Lost Time</label>
                    <input
                      type="time"
                      value={approximateTime}
                      onChange={(e) => setApproximateTime(e.target.value)}
                      className="rounded-input"
                    />
                  </div>

                  {/* Reward Amount (Optional) */}
                  <div className="form-group">
                    <label>Reward Amount (₹) (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      className="rounded-input"
                      min="0"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="form-group">
                    <label className="required">Contact Number</label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="rounded-input"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label>Item Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details such as color, brand, distinct marks, or contents..."
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="rounded-input"
                  ></textarea>
                </div>

                {/* STEP 8: Image Upload & Preview */}
                <div className="form-group full-width upload-section">
                  <label>Upload Item Photo (Optional)</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      id="item-photo-upload"
                      className="file-input"
                    />
                    <label htmlFor="item-photo-upload" className="file-label">
                      <i className="fa-solid fa-cloud-arrow-up"></i> Choose Image Photo
                    </label>
                  </div>

                  {photoPreview && (
                    <div className="image-preview-box">
                      <p>Photo Preview:</p>
                      <img src={photoPreview} alt="Item Preview" className="preview-img" />
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={() => setPhotoPreview(null)}
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span> Submitting Request...
                      </>
                    ) : (
                      "Submit Lost Item Report"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY LOST ITEMS (STEP 5 & 6) */}
      {activeTab === "my-items" && (
        <div className="my-items-container">
          <div className="my-items-header">
            <h2>📋 Reported Lost Items</h2>
            <button className="refresh-btn" onClick={fetchMyItems} disabled={isLoadingItems}>
              <i className={`fa-solid fa-rotate-right ${isLoadingItems ? "fa-spin" : ""}`}></i> Refresh
            </button>
          </div>

          {isLoadingItems ? (
            <div className="loading-box">
              <span className="spinner large"></span>
              <p>Loading items...</p>
            </div>
          ) : myItems.length === 0 ? (
            <div className="empty-box">
              <i className="fa-solid fa-inbox empty-icon"></i>
              <h3>No Lost Items Reported Yet</h3>
              <p>You haven't submitted any lost item reports. Switch to the "Report Lost Item" tab to register a lost item.</p>
            </div>
          ) : (
            <div className="items-grid">
              {myItems.map((item) => (
                <div className="item-card-full" key={item.id}>
                  <div className="item-card-header">
                    <div>
                      <span className="category-pill">{item.itemCategory}</span>
                      <h3>{item.itemName}</h3>
                    </div>
                    <span className={getStatusBadgeClass(item.status)}>
                      {item.status}
                    </span>
                  </div>

                  {item.photo && (
                    <div className="item-img-wrap">
                      <img src={item.photo} alt={item.itemName} />
                    </div>
                  )}

                  <div className="item-card-body">
                    <p className="item-desc">{item.itemDescription || "No description provided."}</p>
                    
                    <div className="info-grid">
                      <div>
                        <strong>Train:</strong> {item.trainName} ({item.trainNumber})
                      </div>
                      <div>
                        <strong>Journey Date:</strong> {item.journeyDate}
                      </div>
                      <div>
                        <strong>Coach & Seat:</strong> {item.coach} / Seat {item.seat}
                      </div>
                      <div>
                        <strong>Lost Location:</strong> {item.lostLocation}
                      </div>
                      <div>
                        <strong>PNR:</strong> {item.pnr}
                      </div>
                      <div>
                        <strong>Passenger:</strong> {item.passengerName}
                      </div>
                      <div>
                        <strong>Contact:</strong> {item.contactNumber}
                      </div>
                      {item.rewardAmount > 0 && (
                        <div>
                          <strong>Reward Offered:</strong> ₹{item.rewardAmount}
                        </div>
                      )}
                      <div>
                        <strong>Reported On:</strong> {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* STEP 6: Status Flow Controls */}
                  <div className="item-card-footer">
                    <span className="flow-label">Status Progression:</span>
                    <div className="status-flow-buttons">
                      <button
                        className={`flow-btn ${item.status === "Pending" ? "current" : ""}`}
                        onClick={() => handleUpdateStatus(item.id, "Pending")}
                        disabled={updatingItemId === item.id}
                      >
                        Pending
                      </button>
                      <i className="fa-solid fa-chevron-right arrow-icon"></i>
                      <button
                        className={`flow-btn ${item.status === "Found" ? "current" : ""}`}
                        onClick={() => handleUpdateStatus(item.id, "Found")}
                        disabled={updatingItemId === item.id}
                      >
                        Found
                      </button>
                      <i className="fa-solid fa-chevron-right arrow-icon"></i>
                      <button
                        className={`flow-btn ${item.status === "Verified" ? "current" : ""}`}
                        onClick={() => handleUpdateStatus(item.id, "Verified")}
                        disabled={updatingItemId === item.id}
                      >
                        Verified
                      </button>
                      <i className="fa-solid fa-chevron-right arrow-icon"></i>
                      <button
                        className={`flow-btn ${item.status === "Returned" ? "current" : ""}`}
                        onClick={() => handleUpdateStatus(item.id, "Returned")}
                        disabled={updatingItemId === item.id}
                      >
                        Returned
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LostItemAI;
