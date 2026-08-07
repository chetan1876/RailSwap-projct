// PNR Status
const PNR_STATUS = {
  CONFIRMED: "Confirmed",
  RAC: "RAC",
  WAITING: "Waiting",
  CANCELLED: "Cancelled",
};

// Success & Error Messages
const PNR_MESSAGES = {
  VERIFIED: "PNR verified successfully.",
  NOT_FOUND: "PNR not found.",
  INVALID: "Invalid PNR number.",
  SERVER_ERROR: "Something went wrong. Please try again.",
};

module.exports = {
  PNR_STATUS,
  PNR_MESSAGES,
};
