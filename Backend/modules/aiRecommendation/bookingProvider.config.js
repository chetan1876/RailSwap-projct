"use strict";

/**
 * Helper to extract station code from string e.g. "Mumbai Central (MMCT)" -> "MMCT"
 */
function extractStationCode(stationStr) {
  if (!stationStr) return "";
  const match = stationStr.match(/\(([A-Z0-9]+)\)/i);
  if (match && match[1]) {
    return match[1].toUpperCase();
  }
  const cleaned = stationStr.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  const parts = cleaned.split(/\s+/);
  if (parts.length > 0) return parts[0].toUpperCase();
  return stationStr.toUpperCase();
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDateYYYYMMDD(dateStr) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format date to DD-MM-YYYY
 */
function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Master configuration for all supported Booking Partners.
 * Adding a new booking partner in future requires modifying ONLY this configuration file.
 */
const BOOKING_PROVIDERS = [
  {
    id: "irctc",
    name: "IRCTC Official",
    tagline: "Official Indian Railways e-Ticketing Portal",
    badge: "Official Partner",
    badgeColor: "#1a56db",
    brandColor: "#0f4c81",
    logoType: "irctc",
    description:
      "Direct booking with official IRCTC credentials. Zero markup fee.",
    features: [
      "Official IRCTC Booking",
      "Direct Cancellation",
      "Loyalty Rewards",
    ],
    supportedClasses: ["1A", "2A", "3A", "3E", "CC", "SL", "2S", "EC"],
    generateUrl: (params) => {
      const src = extractStationCode(params.source);
      const dst = extractStationCode(params.destination);
      const date = formatDateYYYYMMDD(params.travelDate);
      const cls = params.travelClass || "ALL";
      const quota = params.quota || "GN";
      return `https://www.irctc.co.in/nget/booking/train-list?src=${encodeURIComponent(src)}&dst=${encodeURIComponent(dst)}&dt=${encodeURIComponent(date)}&cls=${encodeURIComponent(cls)}&quota=${encodeURIComponent(quota)}`;
    },
  },
  {
    id: "paytm",
    name: "Paytm Trains",
    tagline: "Instant Refunds & Zero Payment Gateway Fee",
    badge: "Instant Refund",
    badgeColor: "#00baf2",
    brandColor: "#002970",
    logoType: "paytm",
    description: "Fastest checkout with Paytm UPI, Wallet, or Credit Cards.",
    features: [
      "Zero Gateway Fee",
      "Instant Refund to Wallet",
      "Live Status Tracking",
    ],
    supportedClasses: ["1A", "2A", "3A", "CC", "SL", "2S"],
    generateUrl: (params) => {
      const src = extractStationCode(params.source);
      const dst = extractStationCode(params.destination);
      const date = formatDateYYYYMMDD(params.travelDate);
      return `https://paytm.com/train-tickets/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(params.travelClass || "ALL")}`;
    },
  },
  {
    id: "confirmtkt",
    name: "ConfirmTkt",
    tagline: "Same Train Alternate Berth & WL Confirmation Predictor",
    badge: "WL Predictor",
    badgeColor: "#22c55e",
    brandColor: "#15803d",
    logoType: "confirmtkt",
    description:
      "Get highest ticket confirmation chances and alternate berth recommendations.",
    features: [
      "99% WL Prediction",
      "Same Train Alternate Berth",
      "Free Cancellation Pass",
    ],
    supportedClasses: ["1A", "2A", "3A", "CC", "SL"],
    generateUrl: (params) => {
      const src = extractStationCode(params.source);
      const dst = extractStationCode(params.destination);
      const date = formatDateDDMMYYYY(params.travelDate);
      const trainNo = params.trainNumber || "";
      return `https://www.confirmtkt.com/rlys/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&quota=${encodeURIComponent(params.quota || "GN")}&trainNo=${encodeURIComponent(trainNo)}`;
    },
  },
  {
    id: "railyatri",
    name: "RailYatri",
    tagline: "Smart Coach Location & Live Station Tracking",
    badge: "Smart Seats",
    badgeColor: "#f59e0b",
    brandColor: "#d97706",
    logoType: "railyatri",
    description:
      "Book tickets along with meal delivery and coach position prediction.",
    features: [
      "Coach Position Map",
      "E-Catering Delivery",
      "24x7 Customer Help",
    ],
    supportedClasses: ["1A", "2A", "3A", "CC", "SL"],
    generateUrl: (params) => {
      const src = extractStationCode(params.source);
      const dst = extractStationCode(params.destination);
      const date = formatDateDDMMYYYY(params.travelDate);
      return `https://www.railyatri.in/booking/trains-between-stations?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}`;
    },
  },
  {
    id: "ixigo",
    name: "ixigo Trains",
    tagline: "Zero Agent Service Charges & Free Cancellation Option",
    badge: "Free Cancel",
    badgeColor: "#ec4899",
    brandColor: "#be185d",
    logoType: "ixigo",
    description:
      "Instant booking confirmation with full refund on cancellation.",
    features: [
      "Assured Instant Refund",
      "Zero Gateway Charge",
      "PNR Status Alerts",
    ],
    supportedClasses: ["1A", "2A", "3A", "CC", "SL", "2S"],
    generateUrl: (params) => {
      const src = extractStationCode(params.source);
      const dst = extractStationCode(params.destination);
      const date = formatDateDDMMYYYY(params.travelDate);
      return `https://www.ixigo.com/trains/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(params.travelClass || "ALL")}`;
    },
  },
  {
    id: "amazonpay",
    name: "Amazon Pay Trains",
    tagline: "Cashback Rewards & One-Click Amazon Pay Balance Checkout",
    badge: "Amazon Cashback",
    badgeColor: "#ff9900",
    brandColor: "#232f3e",
    logoType: "amazonpay",
    description:
      "Seamless train booking with Amazon Pay balance and prime rewards.",
    features: [
      "Amazon Pay Balance",
      "Exclusive Cashbacks",
      "Prime Member Perks",
    ],
    supportedClasses: ["1A", "2A", "3A", "CC", "SL"],
    generateUrl: (params) => {
      const src = extractStationCode(params.source);
      const dst = extractStationCode(params.destination);
      const date = formatDateYYYYMMDD(params.travelDate);
      return `https://www.amazon.in/travel/trains/search?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dst)}&date=${encodeURIComponent(date)}&class=${encodeURIComponent(params.travelClass || "ALL")}`;
    },
  },
];

module.exports = {
  BOOKING_PROVIDERS,
  extractStationCode,
  formatDateYYYYMMDD,
  formatDateDDMMYYYY,
};
