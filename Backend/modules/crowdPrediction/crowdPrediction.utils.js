"use strict";

/*
========================================
CROWD PREDICTION UTILITY FUNCTIONS
========================================
*/

const {
  SEARCH_TYPES,
  KNOWN_TRAINS,
  MAJOR_STATIONS,
  FESTIVAL_PERIODS,
  PEAK_HOUR_MULTIPLIERS,
  DAY_MULTIPLIERS,
  OCCUPANCY_THRESHOLDS,
  CROWD_LEVELS,
  RISK_LEVELS,
  COMFORT_SCORE_THRESHOLDS,
  COACH_OCCUPANCY_BASE,
  TRAIN_TYPE_MULTIPLIERS,
  TRAIN_TYPES,
} = require("./crowdPrediction.constants");

/*
------------------------------------
DETECT SEARCH TYPE AUTOMATICALLY
------------------------------------
*/
const detectSearchType = (query) => {
  if (!query || typeof query !== "string") return SEARCH_TYPES.UNKNOWN;

  const trimmed = query.trim();

  // PNR: exactly 10 digits
  if (/^\d{10}$/.test(trimmed)) return SEARCH_TYPES.PNR;

  // Train Number: 4-5 digits
  if (/^\d{4,5}$/.test(trimmed)) return SEARCH_TYPES.TRAIN_NUMBER;

  // Coach: Alphanumeric like S1, B2, A1, SL4, AC1
  if (/^[A-Z]{1,3}\d{1,2}$/i.test(trimmed)) return SEARCH_TYPES.COACH;

  // Station match
  const stationNames = Object.keys(MAJOR_STATIONS);
  const lowerQuery = trimmed.toLowerCase();
  for (const station of stationNames) {
    if (
      station.toLowerCase().includes(lowerQuery) ||
      lowerQuery.includes(station.toLowerCase())
    ) {
      return SEARCH_TYPES.STATION;
    }
  }

  // Train name keywords
  const trainKeywords = [
    "rajdhani",
    "shatabdi",
    "duronto",
    "express",
    "mail",
    "vande",
    "bharat",
    "garib rath",
    "intercity",
    "superfast",
  ];
  for (const keyword of trainKeywords) {
    if (lowerQuery.includes(keyword)) return SEARCH_TYPES.TRAIN_NAME;
  }

  // Destination/source keywords
  const locationKeywords = ["to", "from", "via", "between"];
  for (const kw of locationKeywords) {
    if (lowerQuery.includes(kw)) return SEARCH_TYPES.SOURCE;
  }

  // Default: try as station or train name
  return SEARCH_TYPES.TRAIN_NAME;
};

/*
------------------------------------
GET SEASON MULTIPLIER
------------------------------------
*/
const getSeasonMultiplier = (date) => {
  try {
    const d = new Date(date || Date.now());
    const month = d.getMonth() + 1; // 1-indexed
    let multiplier = 1.0;

    for (const festival of FESTIVAL_PERIODS) {
      if (festival.months.includes(month)) {
        multiplier = Math.max(multiplier, festival.multiplier);
      }
    }
    return multiplier;
  } catch {
    return 1.0;
  }
};

/*
------------------------------------
GET PEAK HOUR MULTIPLIER
------------------------------------
*/
const getPeakHourMultiplier = (timeStr) => {
  try {
    let hour;
    if (timeStr) {
      const parts = timeStr.split(":");
      hour = parseInt(parts[0], 10);
    } else {
      hour = new Date().getHours();
    }
    return PEAK_HOUR_MULTIPLIERS[hour] || 0.8;
  } catch {
    return 0.8;
  }
};

/*
------------------------------------
GET DAY MULTIPLIER
------------------------------------
*/
const getDayMultiplier = (dateStr) => {
  try {
    const date = dateStr ? new Date(dateStr) : new Date();
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return DAY_MULTIPLIERS[dayName] || 0.82;
  } catch {
    return 0.82;
  }
};

/*
------------------------------------
CALCULATE OCCUPANCY LEVEL
------------------------------------
*/
const getOccupancyLevel = (occupancy) => {
  const capped = Math.min(occupancy, 120);
  if (capped >= OCCUPANCY_THRESHOLDS.OVERCROWDED)
    return CROWD_LEVELS.OVERCROWDED;
  if (capped >= OCCUPANCY_THRESHOLDS.VERY_HIGH) return CROWD_LEVELS.VERY_HIGH;
  if (capped >= OCCUPANCY_THRESHOLDS.HIGH) return CROWD_LEVELS.HIGH;
  if (capped >= OCCUPANCY_THRESHOLDS.MODERATE) return CROWD_LEVELS.MODERATE;
  return CROWD_LEVELS.LOW;
};

/*
------------------------------------
CALCULATE RISK LEVEL
------------------------------------
*/
const getRiskLevel = (occupancy) => {
  if (occupancy >= 100) return RISK_LEVELS.CRITICAL;
  if (occupancy >= 85) return RISK_LEVELS.HIGH;
  if (occupancy >= 65) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

/*
------------------------------------
CALCULATE COMFORT SCORE (0-100)
------------------------------------
*/
const calculateComfortScore = (occupancy) => {
  // Inverse relationship: higher occupancy = lower comfort
  const score = Math.max(0, Math.min(100, 100 - occupancy * 0.9));
  return Math.round(score);
};

/*
------------------------------------
GET COMFORT LABEL
------------------------------------
*/
const getComfortLabel = (score) => {
  if (score >= COMFORT_SCORE_THRESHOLDS.EXCELLENT) return "Excellent";
  if (score >= COMFORT_SCORE_THRESHOLDS.GOOD) return "Good";
  if (score >= COMFORT_SCORE_THRESHOLDS.FAIR) return "Fair";
  if (score >= COMFORT_SCORE_THRESHOLDS.POOR) return "Poor";
  return "Very Poor";
};

/*
------------------------------------
GENERATE COACH LIST
------------------------------------
*/
const generateCoachList = (trainType, baseOccupancy) => {
  const coaches = [];

  // AC First Class
  const acFirst = { base: 55, variance: 15 };
  // AC 2T
  const ac2t = { base: 68, variance: 18 };
  // AC 3T
  const ac3t = { base: 82, variance: 20 };
  // Sleeper
  const sleeper = { base: 90, variance: 25 };
  // General
  const general = { base: 105, variance: 30 };

  const deterministicOccupancy = (base, variance, seed) => {
    // Deterministic pseudo-random using seed so same train gives same result
    const pseudoRandom = ((seed * 9301 + 49297) % 233280) / 233280;
    const raw = base + (pseudoRandom - 0.5) * variance;
    return Math.round(Math.max(5, Math.min(120, raw)));
  };

  let coachNum = 1;

  // Loco
  coaches.push({
    coach: "ENG",
    type: "Engine",
    occupancy: 0,
    seats: 0,
    available: 0,
  });

  // Based on train type, add coaches
  if (trainType === TRAIN_TYPES.RAJDHANI || trainType === TRAIN_TYPES.DURONTO) {
    // 1A - 1 coach
    coaches.push({
      coach: "A1",
      type: "1A",
      occupancy: deterministicOccupancy(acFirst.base, acFirst.variance, 1),
      seats: 18,
      available: 0,
    });
    // 2A - 4 coaches
    for (let i = 1; i <= 4; i++) {
      const occ = deterministicOccupancy(ac2t.base, ac2t.variance, i + 10);
      coaches.push({
        coach: `B${i}`,
        type: "2A",
        occupancy: occ,
        seats: 46,
        available: 0,
      });
    }
    // 3A - 8 coaches
    for (let i = 1; i <= 8; i++) {
      const occ = deterministicOccupancy(ac3t.base, ac3t.variance, i + 20);
      coaches.push({
        coach: `C${i}`,
        type: "3A",
        occupancy: occ,
        seats: 64,
        available: 0,
      });
    }
  } else if (
    trainType === TRAIN_TYPES.SHATABDI ||
    trainType === TRAIN_TYPES.VANDE_BHARAT
  ) {
    // Chair cars
    coaches.push({
      coach: "EC1",
      type: "EC",
      occupancy: deterministicOccupancy(60, 15, 1),
      seats: 56,
      available: 0,
    });
    for (let i = 1; i <= 10; i++) {
      const occ = deterministicOccupancy(72, 20, i + 5);
      coaches.push({
        coach: `CC${i}`,
        type: "CC",
        occupancy: occ,
        seats: 78,
        available: 0,
      });
    }
  } else {
    // General express/mail - SL + GN + AC
    if (trainType !== TRAIN_TYPES.PASSENGER) {
      coaches.push({
        coach: "A1",
        type: "1A",
        occupancy: deterministicOccupancy(acFirst.base, acFirst.variance, 1),
        seats: 18,
        available: 0,
      });
      for (let i = 1; i <= 3; i++) {
        const occ = deterministicOccupancy(ac2t.base, ac2t.variance, i + 10);
        coaches.push({
          coach: `B${i}`,
          type: "2A",
          occupancy: occ,
          seats: 46,
          available: 0,
        });
      }
      for (let i = 1; i <= 4; i++) {
        const occ = deterministicOccupancy(ac3t.base, ac3t.variance, i + 20);
        coaches.push({
          coach: `C${i}`,
          type: "3A",
          occupancy: occ,
          seats: 64,
          available: 0,
        });
      }
    }
    // Sleeper coaches
    for (let i = 1; i <= 10; i++) {
      const occ = deterministicOccupancy(
        sleeper.base,
        sleeper.variance,
        i + 30,
      );
      coaches.push({
        coach: `S${i}`,
        type: "SL",
        occupancy: occ,
        seats: 72,
        available: 0,
      });
    }
    // General coaches
    for (let i = 1; i <= 4; i++) {
      const occ = deterministicOccupancy(
        general.base,
        general.variance,
        i + 50,
      );
      coaches.push({
        coach: `GN${i}`,
        type: "GN",
        occupancy: Math.min(120, occ),
        seats: 90,
        available: 0,
      });
    }
  }

  // Apply base occupancy scaling and calculate available seats
  return coaches.map((c) => {
    if (c.occupancy === 0 && c.coach === "ENG") return c;
    const scaledOccupancy = Math.round(
      Math.min(120, c.occupancy * (baseOccupancy / 80)),
    );
    const occupied = Math.round((scaledOccupancy / 100) * c.seats);
    const available = Math.max(0, c.seats - occupied);
    return {
      ...c,
      occupancy: scaledOccupancy,
      occupied,
      available,
      crowdLevel: getOccupancyLevel(scaledOccupancy),
      riskLevel: getRiskLevel(scaledOccupancy),
      comfortScore: calculateComfortScore(scaledOccupancy),
    };
  });
};

/*
------------------------------------
DETECT TRAIN TYPE FROM NAME/NUMBER
------------------------------------
*/
const detectTrainType = (query) => {
  const lower = (query || "").toLowerCase();
  if (lower.includes("rajdhani")) return TRAIN_TYPES.RAJDHANI;
  if (lower.includes("shatabdi")) return TRAIN_TYPES.SHATABDI;
  if (lower.includes("duronto")) return TRAIN_TYPES.DURONTO;
  if (lower.includes("vande") || lower.includes("bharat"))
    return TRAIN_TYPES.VANDE_BHARAT;
  if (lower.includes("garib rath")) return TRAIN_TYPES.GARIB_RATH;
  if (lower.includes("intercity")) return TRAIN_TYPES.INTERCITY;
  if (lower.includes("superfast")) return TRAIN_TYPES.SUPERFAST;
  if (lower.includes("mail")) return TRAIN_TYPES.MAIL;
  if (lower.includes("passenger")) return TRAIN_TYPES.PASSENGER;
  return TRAIN_TYPES.EXPRESS;
};

/*
------------------------------------
GENERATE TIMELINE PREDICTIONS
------------------------------------
*/
const generateTimeline = (currentOccupancy, stations) => {
  const timePoints = [
    "Now",
    "+15 min",
    "+30 min",
    "+1 Hour",
    "Next Station",
    "Destination",
  ];
  const trends = [0, 3, 6, -4, 12, -25]; // Typical crowd change pattern

  return timePoints.map((label, index) => {
    const occ = Math.max(5, Math.min(120, currentOccupancy + trends[index]));
    return {
      label,
      occupancy: Math.round(occ),
      crowdLevel: getOccupancyLevel(occ),
      trend:
        trends[index] > 0
          ? "increasing"
          : trends[index] < 0
            ? "decreasing"
            : "stable",
    };
  });
};

/*
------------------------------------
GENERATE SMART ALERTS
------------------------------------
*/
const generateAlerts = (occupancy, trainInfo, coaches, date) => {
  const alerts = [];
  const now = new Date(date || Date.now());
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });

  if (occupancy >= 100) {
    alerts.push({
      type: "critical",
      icon: "🚨",
      title: "Train Overcrowded",
      message:
        "Current occupancy exceeds capacity. Avoid general coaches. Consider alternate trains.",
    });
  } else if (occupancy >= 85) {
    alerts.push({
      type: "warning",
      icon: "⚠️",
      title: "Heavy Rush Expected",
      message:
        "Crowd levels are very high. Board from the front of the platform for better chance.",
    });
  }

  if (dayName === "Friday" || dayName === "Saturday" || dayName === "Sunday") {
    alerts.push({
      type: "info",
      icon: "📅",
      title: "Weekend Rush",
      message:
        "Weekend travel increases crowd by ~10-15%. Pre-book seats if possible.",
    });
  }

  if ([10, 11].includes(month)) {
    alerts.push({
      type: "festive",
      icon: "🪔",
      title: "Festive Season Crowd",
      message:
        "Festival season significantly increases passenger load. Expect higher occupancy.",
    });
  }

  if ([5, 6].includes(month)) {
    alerts.push({
      type: "info",
      icon: "🏖️",
      title: "Summer Vacation Rush",
      message:
        "Summer school holidays boost crowd by 15-20%. Platform congestion likely.",
    });
  }

  if (hour >= 7 && hour <= 10) {
    alerts.push({
      type: "peak",
      icon: "⏰",
      title: "Morning Peak Hours",
      message:
        "7 AM - 10 AM is peak boarding time. Arrive 30 minutes early for better positioning.",
    });
  } else if (hour >= 17 && hour <= 20) {
    alerts.push({
      type: "peak",
      icon: "🌆",
      title: "Evening Peak Hours",
      message:
        "5 PM - 8 PM is peak evening travel. Expect heavy platform crowd.",
    });
  }

  // Check most crowded coach
  const nonEngineCoaches = coaches.filter((c) => c.coach !== "ENG");
  if (nonEngineCoaches.length > 0) {
    const mostCrowded = nonEngineCoaches.reduce((a, b) =>
      a.occupancy > b.occupancy ? a : b,
    );
    if (mostCrowded.occupancy >= 90) {
      alerts.push({
        type: "warning",
        icon: "🚃",
        title: `Coach ${mostCrowded.coach} Overcrowded`,
        message: `Coach ${mostCrowded.coach} is at ${mostCrowded.occupancy}% capacity. Avoid this coach.`,
      });
    }
  }

  // Late night low crowd
  if (hour >= 23 || hour <= 4) {
    alerts.push({
      type: "good",
      icon: "🌙",
      title: "Late Night - Low Crowd",
      message:
        "Late night travel typically means less crowd. Good time to board comfortably.",
    });
  }

  return alerts;
};

/*
------------------------------------
GENERATE RECOMMENDATIONS
------------------------------------
*/
const generateRecommendations = (coaches, occupancy, trainInfo) => {
  const recommendations = [];
  const nonEngine = coaches.filter((c) => c.coach !== "ENG");
  const sorted = [...nonEngine].sort((a, b) => a.occupancy - b.occupancy);
  const leastCrowded = sorted[0];
  const mostCrowded = sorted[sorted.length - 1];

  if (leastCrowded) {
    recommendations.push({
      priority: "high",
      icon: "✅",
      title: "Best Coach",
      message: `Move to Coach ${leastCrowded.coach} (${leastCrowded.type}) - only ${leastCrowded.occupancy}% full with ${leastCrowded.available} seats available.`,
    });
  }

  if (mostCrowded && mostCrowded.occupancy > 85) {
    recommendations.push({
      priority: "high",
      icon: "🚫",
      title: "Avoid Coach",
      message: `Avoid Coach ${mostCrowded.coach} - ${mostCrowded.occupancy}% full and highly congested.`,
    });
  }

  if (occupancy < 60) {
    recommendations.push({
      priority: "medium",
      icon: "😊",
      title: "Journey Comfort Good",
      message:
        "Current crowd levels are comfortable. You can choose any coach freely.",
    });
  }

  if (occupancy > 80) {
    recommendations.push({
      priority: "high",
      icon: "🕐",
      title: "Best Boarding Time",
      message:
        "Board 20-30 minutes before departure to secure a comfortable spot.",
    });

    recommendations.push({
      priority: "medium",
      icon: "🚉",
      title: "Platform Strategy",
      message:
        "Board from Gate 1 or 2 (front of platform) for AC coaches. Rear gates for sleeper.",
    });
  }

  recommendations.push({
    priority: "low",
    icon: "📊",
    title: "Historical Trend",
    message:
      "Based on historical data, crowd typically reduces after first 2-3 major stations.",
  });

  if (trainInfo && trainInfo.type) {
    const typeTip = {
      [TRAIN_TYPES.RAJDHANI]:
        "Rajdhani trains are popular. Book 2A or 3A AC coaches for best comfort.",
      [TRAIN_TYPES.SHATABDI]:
        "Shatabdi trains have fixed seating. All coaches maintain similar crowd density.",
      [TRAIN_TYPES.VANDE_BHARAT]:
        "Vande Bharat: Executive Chair Car (EC) has significantly lower occupancy.",
      [TRAIN_TYPES.EXPRESS]:
        "For express trains, Sleeper coaches see highest occupancy. AC coaches are better.",
    };
    const tip = typeTip[trainInfo.type];
    if (tip) {
      recommendations.push({
        priority: "low",
        icon: "💡",
        title: "Train Type Tip",
        message: tip,
      });
    }
  }

  return recommendations;
};

/*
------------------------------------
CALCULATE CONFIDENCE SCORE
------------------------------------
*/
const calculateConfidenceScore = (trainInfo, hasHistoricalData) => {
  let score = 70; // Base confidence
  if (trainInfo && KNOWN_TRAINS[trainInfo.number]) score += 20;
  if (hasHistoricalData) score += 5;
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 22) score += 5; // Higher confidence during active hours
  return Math.min(99, score);
};

module.exports = {
  detectSearchType,
  getSeasonMultiplier,
  getPeakHourMultiplier,
  getDayMultiplier,
  getOccupancyLevel,
  getRiskLevel,
  calculateComfortScore,
  getComfortLabel,
  generateCoachList,
  detectTrainType,
  generateTimeline,
  generateAlerts,
  generateRecommendations,
  calculateConfidenceScore,
};
