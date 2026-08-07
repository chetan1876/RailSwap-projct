const {
  DashboardDTO,
  CompanionDTO,
  SeatDTO,
  InsightDTO,
} = require("./womenSafety.dto");

const companionMapper = (companion) => {
  if (!companion) return null;
  let data = companion;
  if (typeof companion === "string") {
    try {
      data = JSON.parse(companion);
    } catch (_) {}
  }
  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    if (keys.length === 1 && typeof keys[0] === "string" && (keys[0].startsWith("[") || keys[0].startsWith("{"))) {
      try {
        const parsed = JSON.parse(keys[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          data = parsed[0];
        } else if (typeof parsed === "object" && parsed !== null) {
          data = parsed;
        }
      } catch (_) {}
    }
  }

  return new CompanionDTO({
    id: data.id || data._id || "1",
    name: data.name || "Priya Sharma",
    age: data.age || 25,
    verified: data.verified ?? true,
    match: data.matchPercentage ? `${data.matchPercentage}%` : (data.match || "95%"),
    coach: data.coach || "B2",
    seatNumber: data.seatNumber || "21",
    profileImage: data.profileImage || "",
    trustScore: data.trustScore || 95,
  });
};

const seatMapper = (seat) => {
  if (!seat) return null;
  let data = seat;
  if (typeof seat === "string") {
    try {
      data = JSON.parse(seat);
    } catch (_) {}
  }
  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    if (keys.length === 1 && typeof keys[0] === "string" && (keys[0].startsWith("[") || keys[0].startsWith("{"))) {
      try {
        const parsed = JSON.parse(keys[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          data = parsed[0];
        } else if (typeof parsed === "object" && parsed !== null) {
          data = parsed;
        }
      } catch (_) {}
    }
  }

  return new SeatDTO({
    coach: data.coach || "B2",
    seatNumber: data.seatNumber || "21",
    badge: data.badge || "Safe",
    match: data.matchPercentage ? `${data.matchPercentage}%` : (data.match || "98%"),
  });
};

const insightMapper = (insight) => {
  if (!insight) return null;
  let data = insight;
  if (typeof insight === "string") {
    try {
      data = JSON.parse(insight);
    } catch (_) {}
  }

  return new InsightDTO({
    title: data.title || "AI Safety Insight",
    description: data.description || "Coach B2 currently has the highest women traveler density.",
    riskLevel: data.riskLevel || "LOW",
  });
};

const dashboardMapper = (document) => {
  if (!document) return null;

  const rawSeats = Array.isArray(document.safeSeats) ? document.safeSeats : [];
  const rawCompanions = Array.isArray(document.companions) ? document.companions : [];

  return new DashboardDTO({
    safetyScore: document.safetyScore ?? 96,
    safetyStatus:
      (document.safetyScore ?? 96) >= 95
        ? "Excellent Safety Zone"
        : (document.safetyScore ?? 96) >= 80
        ? "Good Safety Zone"
        : (document.safetyScore ?? 96) >= 60
        ? "Average Safety Zone"
        : "Risk Zone",

    verifiedTravelers: document.verifiedTravelers ?? 120,
    activeTravelers: document.activeTravelers ?? 85,
    aiMonitoring: document.aiMonitoring ?? true,
    safetyAccuracy: document.safetyAccuracy ?? 98,
    safeSeats: rawSeats.map(seatMapper).filter(Boolean),
    companions: rawCompanions.map(companionMapper).filter(Boolean),
    aiInsight: insightMapper(document.insight),
  });
};

module.exports = {
  dashboardMapper,
  companionMapper,
  seatMapper,
  insightMapper,
};