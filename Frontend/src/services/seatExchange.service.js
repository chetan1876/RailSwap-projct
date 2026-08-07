import api from "./api";

// Create Seat Exchange Request
export const createSeatExchangeRequest = async (formData) => {
  const response = await api.post("/seat-exchange/request", formData);
  return response.data;
};

// Process Paytm Post-Acceptance Payment (₹50 Fee)
export const processPaytmPostAcceptancePayment = async (paymentData) => {
  const response = await api.post("/seat-exchange/pay-post-acceptance", paymentData);
  return response.data;
};

// Process Donation Payment (₹50 Fee)
export const processDonationPayment = async (paymentData) => {
  const response = await api.post("/seat-exchange/pay", paymentData);
  return response.data;
};


// Get All Requests
export const getAllSeatExchangeRequests = async () => {
  const response = await api.get("/seat-exchange/requests");
  return response.data;
};

// Find Matching Passengers
export const findMatchingPassengers = async (matchCriteria) => {
  const response = await api.post("/seat-exchange/find-matches", matchCriteria);
  return response.data;
};

// Accept Seat Exchange
export const acceptSeatExchange = async (requestId, matchedUserId) => {
  const response = await api.patch(`/seat-exchange/accept/${requestId}`, {
    matchedUserId,
  });
  return response.data;
};

// Reject Seat Exchange
export const rejectSeatExchange = async (requestId) => {
  const response = await api.patch(`/seat-exchange/reject/${requestId}`);
  return response.data;
};

// Cancel Request
export const cancelSeatExchange = async (requestId) => {
  const response = await api.patch(`/seat-exchange/cancel/${requestId}`);
  return response.data;
};

// Get Payment History
export const getPaymentHistory = async (userId = "user123") => {
  const response = await api.get(`/seat-exchange/payments?userId=${userId}`);
  return response.data;
};
