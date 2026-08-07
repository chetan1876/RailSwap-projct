// ==========================================
// Seat Exchange Constants
// ==========================================

// Request Status Workflow Sequence
const REQUEST_STATUS = {
  PENDING: "PENDING",                     // Step 1: Request created without payment
  ACCEPTED: "ACCEPTED",                   // Step 2: Passenger accepts request
  PAYMENT_PENDING: "PAYMENT_PENDING",     // Step 3: Payment screen unlocked for Requester
  PAYMENT_SUCCESSFUL: "PAYMENT_SUCCESSFUL",// Step 4: Paytm payment completed
  COMPLETED: "COMPLETED",                 // Step 5: Seat exchange completed
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

// Payment Status
const PAYMENT_STATUS = {
  UNLOCKED: "UNLOCKED",
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

// Payment Configuration
const DONATION_CONFIG = {
  FEE_AMOUNT: 50, // ₹50 Platform Fee / Receiver Escrow Reward
  CURRENCY: "INR",
  GATEWAY_PROVIDER: "PAYTM",
};

// Available Train Coaches List
const TRAIN_COACHES = [
  "B1", "B2", "B3", "B4", "B5", "B6",
  "A1", "A2", "A3",
  "H1",
  "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10",
  "HA1", "SE1", "GS1"
];

// Seat Preferences
const SEAT_PREFERENCE = {
  LOWER: "Lower Berth",
  MIDDLE: "Middle Berth",
  UPPER: "Upper Berth",
  SIDE_LOWER: "Side Lower",
  SIDE_UPPER: "Side Upper",
  WINDOW: "Window Seat",
  ANY: "Any",
};

// Priority Preferences
const PRIORITY_PREFERENCE = {
  SAME_COACH: "Same Coach",
  SAME_CABIN: "Same Cabin",
  NEARBY_SEAT: "Nearby Seat",
  SAME_JOURNEY: "Same Journey",
  MEDICAL: "Medical Priority",
  SENIOR_CITIZEN: "Senior Citizen",
  FAMILY: "Family Preference",
};

// Gender
const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

// AI Match Weights
const MATCH_WEIGHTS = {
  SAME_TRAIN_DATE: 20,
  SAME_COACH: 25,
  SAME_CABIN: 15,
  BERTH_COMPATIBILITY: 25,
  JOURNEY_OVERLAP: 15,
  MEDICAL_PRIORITY: 10,
  SENIOR_CITIZEN_PRIORITY: 10,
  FAMILY_PRIORITY: 10,
};

// Messages
const MESSAGE = {
  REQUEST_CREATED: "Seat exchange request created successfully! Status is set to Pending.",
  REQUEST_ACCEPTED: "Seat exchange request accepted! Seat Exchange Confirmed. Paytm Payment Screen unlocked.",
  PAYMENT_SUCCESSFUL: "Paytm payment of ₹50 verified successfully! Exchange is now completed.",
  PAYMENT_REQUIRED: "Payment is unlocked only after passenger acceptance.",
  REQUEST_UPDATED: "Seat exchange request updated successfully.",
  REQUEST_REJECTED: "Seat exchange request rejected successfully.",
  REQUEST_CANCELLED: "Seat exchange request cancelled successfully.",
  REQUEST_NOT_FOUND: "Seat exchange request not found.",
  MATCH_FOUND: "Matching passengers found using AI match scoring.",
  NO_MATCH_FOUND: "No matching passengers found.",
};

// Export
module.exports = {
  REQUEST_STATUS,
  PAYMENT_STATUS,
  DONATION_CONFIG,
  TRAIN_COACHES,
  SEAT_PREFERENCE,
  PRIORITY_PREFERENCE,
  GENDER,
  MATCH_WEIGHTS,
  MESSAGE,
};
