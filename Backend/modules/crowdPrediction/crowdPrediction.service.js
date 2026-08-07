"use strict";

/*
========================================
CROWD PREDICTION ENGINE (AI SERVICE)
========================================
*/

const {
  KNOWN_TRAINS,
  MAJOR_STATIONS,
  SEARCH_TYPES,
  TRAIN_TYPES,
  TRAIN_TYPE_MULTIPLIERS,
  COACH_OCCUPANCY_BASE,
} = require("./crowdPrediction.constants");

const {
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
} = require("./crowdPrediction.utils");

/*
------------------------------------
INTERNAL: GENERATE BASE OCCUPANCY
------------------------------------
*/
const _computeBaseOccupancy = (trainInfo, date, time) => {
  const trainType = (trainInfo && trainInfo.type) || TRAIN_TYPES.EXPRESS;
  const typeMultiplier = TRAIN_TYPE_MULTIPLIERS[trainType] || 0.78;
  const peakMultiplier = getPeakHourMultiplier(time);
  const dayMultiplier = getDayMultiplier(date);
  const seasonMultiplier = getSeasonMultiplier(date);

  // Base occupancy from known train data or default
  let baseOccupancy =
    trainInfo && trainInfo.avgOccupancy ? trainInfo.avgOccupancy : 75;

  // Apply all multipliers
  const adjustedOccupancy =
    baseOccupancy *
    typeMultiplier *
    peakMultiplier *
    dayMultiplier *
    seasonMultiplier;

  // Add small deterministic noise based on train number
  const seed =
    trainInfo && trainInfo.number ? parseInt(trainInfo.number, 10) : 12345;
  const noise = (seed % 17) - 8; // -8 to +8
  const finalOccupancy = Math.round(
    Math.max(10, Math.min(115, adjustedOccupancy + noise)),
  );

  return finalOccupancy;
};

/*
------------------------------------
INTERNAL: BUILD TRAIN INFO FROM QUERY
------------------------------------
*/
const _buildTrainInfo = (query, searchType) => {
  let trainInfo = null;

  if (searchType === SEARCH_TYPES.TRAIN_NUMBER) {
    // Check known trains first
    if (KNOWN_TRAINS[query]) {
      trainInfo = { number: query, ...KNOWN_TRAINS[query] };
    } else {
      // Generate realistic info for unknown train numbers
      const num = parseInt(query, 10);
      let type = TRAIN_TYPES.EXPRESS;
      if (num >= 12001 && num <= 12099) type = TRAIN_TYPES.SHATABDI;
      else if (num >= 12200 && num <= 12299) type = TRAIN_TYPES.DURONTO;
      else if (num >= 12301 && num <= 12399) type = TRAIN_TYPES.RAJDHANI;
      else if (num >= 22400 && num <= 22599) type = TRAIN_TYPES.VANDE_BHARAT;
      else if (num >= 14000 && num <= 14999) type = TRAIN_TYPES.EXPRESS;

      trainInfo = {
        number: query,
        name: `Train ${query}`,
        type,
        source: "Origin Station",
        destination: "Destination Station",
        distance: 500 + (num % 1500),
        avgOccupancy: 75,
      };
    }
  } else if (searchType === SEARCH_TYPES.TRAIN_NAME) {
    const type = detectTrainType(query);
    const multiplier = TRAIN_TYPE_MULTIPLIERS[type] || 0.78;
    trainInfo = {
      number: "XXXXX",
      name: query,
      type,
      source: "Origin",
      destination: "Destination",
      distance: 800,
      avgOccupancy: Math.round(75 * multiplier),
    };
  } else if (searchType === SEARCH_TYPES.STATION) {
    const stationData = Object.entries(MAJOR_STATIONS).find(
      ([name]) =>
        name.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(name.toLowerCase()),
    );
    if (stationData) {
      trainInfo = {
        number: "STATION",
        name: `${stationData[0]} Station`,
        type: TRAIN_TYPES.EXPRESS,
        source: stationData[0],
        destination: "Multiple",
        distance: 0,
        avgOccupancy: 72,
        stationInfo: stationData[1],
      };
    } else {
      trainInfo = {
        number: "STATION",
        name: `${query} Station`,
        type: TRAIN_TYPES.EXPRESS,
        source: query,
        destination: "Multiple",
        distance: 0,
        avgOccupancy: 70,
      };
    }
  } else if (searchType === SEARCH_TYPES.PNR) {
    // Generate train info from PNR (last 4 digits as seed)
    const seed = parseInt(query.slice(-4), 10);
    const num = 12000 + (seed % 5000);
    trainInfo = {
      number: String(num),
      name: `PNR Train ${num}`,
      type: TRAIN_TYPES.EXPRESS,
      source: "Origin",
      destination: "Destination",
      distance: 600 + (seed % 1000),
      avgOccupancy: 70 + (seed % 20),
      pnr: query,
    };
  } else if (searchType === SEARCH_TYPES.COACH) {
    const coachType = query.replace(/\d/g, "").toUpperCase();
    const coachBase = COACH_OCCUPANCY_BASE[coachType] || {
      base: 75,
      variance: 20,
    };
    trainInfo = {
      number: "COACH",
      name: `Coach ${query} Search`,
      type: TRAIN_TYPES.EXPRESS,
      source: "Origin",
      destination: "Destination",
      distance: 600,
      avgOccupancy: coachBase.base,
      coachFilter: query,
    };
  } else {
    trainInfo = {
      number: "SEARCH",
      name: query,
      type: detectTrainType(query),
      source: "Origin",
      destination: "Destination",
      distance: 600,
      avgOccupancy: 75,
    };
  }

  return trainInfo;
};

/*
========================================
MAIN: PREDICT CROWD (SMART SEARCH)
========================================
*/
const predictCrowdBySearch = async (query, filters = {}) => {
  const searchType = detectSearchType(query);
  const trainInfo = _buildTrainInfo(query, searchType);

  const date = filters.date || new Date().toISOString().split("T")[0];
  const time =
    filters.time ||
    `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, "0")}`;

  // Compute overall occupancy
  const overallOccupancy = _computeBaseOccupancy(trainInfo, date, time);

  // Generate coaches
  const coaches = generateCoachList(trainInfo.type, overallOccupancy);
  const nonEngineCoaches = coaches.filter((c) => c.coach !== "ENG");

  // Compute aggregate stats
  const totalSeats = nonEngineCoaches.reduce((sum, c) => sum + c.seats, 0);
  const totalOccupied = nonEngineCoaches.reduce(
    (sum, c) => sum + c.occupied,
    0,
  );
  const totalAvailable = nonEngineCoaches.reduce(
    (sum, c) => sum + c.available,
    0,
  );
  const avgOccupancy = nonEngineCoaches.length
    ? Math.round(
        nonEngineCoaches.reduce((sum, c) => sum + c.occupancy, 0) /
          nonEngineCoaches.length,
      )
    : overallOccupancy;

  // Timeline
  const timeline = generateTimeline(avgOccupancy, []);

  // Alerts
  const alerts = generateAlerts(
    avgOccupancy,
    trainInfo,
    nonEngineCoaches,
    date,
  );

  // Recommendations
  const recommendations = generateRecommendations(
    nonEngineCoaches,
    avgOccupancy,
    trainInfo,
  );

  // Comfort & Risk
  const comfortScore = calculateComfortScore(avgOccupancy);
  const comfortLabel = getComfortLabel(comfortScore);
  const riskLevel = getRiskLevel(avgOccupancy);
  const crowdLevel = getOccupancyLevel(avgOccupancy);
  const confidenceScore = calculateConfidenceScore(
    trainInfo,
    !!KNOWN_TRAINS[trainInfo.number],
  );

  // Station crowd
  const stationCrowd = _generateStationCrowd(trainInfo, date, time);

  // Heatmap data
  const heatmap = _generateHeatmap(nonEngineCoaches);

  // Summary dashboard stats
  const dashboard = {
    overallCrowd: avgOccupancy,
    crowdLevel,
    riskLevel,
    totalSeats,
    totalOccupied,
    totalAvailable,
    expectedOccupancy: Math.round(avgOccupancy * 1.05),
    comfortScore,
    comfortLabel,
    confidenceScore,
    predictedPeakTime: _getPredictedPeakTime(),
    searchType,
  };

  return {
    success: true,
    query,
    searchType,
    trainInfo,
    dashboard,
    coaches: nonEngineCoaches,
    heatmap,
    timeline,
    stationCrowd,
    alerts,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
};

/*
------------------------------------
INTERNAL: STATION CROWD
------------------------------------
*/
const _generateStationCrowd = (trainInfo, date, time) => {
  const stationList = [
    { name: trainInfo.source || "Source Station", type: "departure" },
    { name: "Intermediate 1", type: "intermediate" },
    { name: "Intermediate 2", type: "intermediate" },
    { name: trainInfo.destination || "Destination", type: "arrival" },
  ];

  return stationList.map((station, index) => {
    const baseOccupancy = 65 + index * 5;
    const occ = Math.round(Math.min(110, baseOccupancy + ((index * 7) % 15)));
    return {
      station: station.name,
      type: station.type,
      platformCrowd: occ,
      boardingPrediction: Math.round(occ * 0.4),
      alightingPrediction: Math.round(occ * 0.3),
      crowdLevel: getOccupancyLevel(occ),
      riskLevel: getRiskLevel(occ),
    };
  });
};

/*
------------------------------------
INTERNAL: HEATMAP DATA
------------------------------------
*/
const _generateHeatmap = (coaches) => {
  return coaches.map((coach) => ({
    coach: coach.coach,
    type: coach.type,
    occupancy: coach.occupancy,
    color: _getHeatmapColor(coach.occupancy),
    intensity: Math.min(1, coach.occupancy / 100),
  }));
};

const _getHeatmapColor = (occupancy) => {
  if (occupancy >= 100) return "#7f1d1d"; // Dark Red
  if (occupancy >= 85) return "#ef4444"; // Red
  if (occupancy >= 65) return "#f97316"; // Orange
  if (occupancy >= 40) return "#eab308"; // Yellow
  return "#22c55e"; // Green
};

/*
------------------------------------
INTERNAL: GET PREDICTED PEAK TIME
------------------------------------
*/
const _getPredictedPeakTime = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 8) return "8:00 AM - 10:00 AM";
  if (hour < 17) return "5:00 PM - 7:00 PM";
  return "Next Morning 8:00 AM";
};

/*
========================================
GET TRAIN CROWD (by train number/name)
========================================
*/
const getTrainCrowd = async (trainId) => {
  return predictCrowdBySearch(trainId, {});
};

/*
========================================
GET COACH CROWD (by coach code)
========================================
*/
const getCoachCrowd = async (coachCode) => {
  return predictCrowdBySearch(coachCode, {});
};

/*
========================================
GET HEATMAP (by train ID)
========================================
*/
const getTrainHeatmap = async (trainId) => {
  const result = await predictCrowdBySearch(trainId, {});
  return {
    trainInfo: result.trainInfo,
    heatmap: result.heatmap,
    coaches: result.coaches,
    generatedAt: result.generatedAt,
  };
};

/*
========================================
GET TIMELINE (by train ID)
========================================
*/
const getTrainTimeline = async (trainId) => {
  const result = await predictCrowdBySearch(trainId, {});
  return {
    trainInfo: result.trainInfo,
    timeline: result.timeline,
    dashboard: result.dashboard,
    generatedAt: result.generatedAt,
  };
};

/*
========================================
GET RECOMMENDATIONS
========================================
*/
const getSmartRecommendations = async (query) => {
  const result = await predictCrowdBySearch(query || "Express Train", {});
  return {
    recommendations: result.recommendations,
    alerts: result.alerts,
    trainInfo: result.trainInfo,
    dashboard: result.dashboard,
    generatedAt: result.generatedAt,
  };
};

/*
========================================
GET ALERTS
========================================
*/
const getSmartAlerts = async (query) => {
  const result = await predictCrowdBySearch(query || "Express Train", {});
  return {
    alerts: result.alerts,
    trainInfo: result.trainInfo,
    dashboard: result.dashboard,
    generatedAt: result.generatedAt,
  };
};

/*
========================================
GET DASHBOARD SUMMARY
========================================
*/
const getDashboardSummary = async () => {
  const popularTrains = ["12301", "12951", "12001", "22439", "12621"];
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  const date = now.toISOString().split("T")[0];

  const predictions = await Promise.all(
    popularTrains.map((trainNum) =>
      predictCrowdBySearch(trainNum, { date, time }),
    ),
  );

  const avgOccupancy = Math.round(
    predictions.reduce((sum, p) => sum + p.dashboard.overallCrowd, 0) /
      predictions.length,
  );

  const totalAvailable = predictions.reduce(
    (sum, p) => sum + p.dashboard.totalAvailable,
    0,
  );

  const alerts = predictions.flatMap((p) => p.alerts).slice(0, 5);

  return {
    summary: {
      avgOccupancy,
      totalAvailable,
      activeTrains: popularTrains.length,
      riskLevel: getRiskLevel(avgOccupancy),
      comfortScore: calculateComfortScore(avgOccupancy),
      comfortLabel: getComfortLabel(calculateComfortScore(avgOccupancy)),
      lastUpdated: new Date().toISOString(),
    },
    trains: predictions.map((p) => ({
      trainInfo: p.trainInfo,
      dashboard: p.dashboard,
    })),
    alerts,
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  predictCrowdBySearch,
  getTrainCrowd,
  getCoachCrowd,
  getTrainHeatmap,
  getTrainTimeline,
  getSmartRecommendations,
  getSmartAlerts,
  getDashboardSummary,
};
