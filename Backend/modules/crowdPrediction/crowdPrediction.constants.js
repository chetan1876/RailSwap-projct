"use strict";

/*
========================================
CROWD PREDICTION CONSTANTS
========================================
*/

const CROWD_LEVELS = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
  VERY_HIGH: "Very High",
  OVERCROWDED: "Overcrowded",
};

const RISK_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const TRAIN_TYPES = {
  RAJDHANI: "Rajdhani",
  SHATABDI: "Shatabdi",
  DURONTO: "Duronto",
  VANDE_BHARAT: "Vande Bharat",
  GARIB_RATH: "Garib Rath",
  SUPERFAST: "Superfast",
  EXPRESS: "Express",
  PASSENGER: "Passenger",
  MAIL: "Mail",
  INTERCITY: "Intercity",
};

const COACH_TYPES = {
  AC_FIRST: "1A",
  AC_TWO_TIER: "2A",
  AC_THREE_TIER: "3A",
  SLEEPER: "SL",
  GENERAL: "GN",
  CHAIR_CAR: "CC",
  AC_CHAIR_CAR: "EC",
};

// Base occupancy multipliers by train type
const TRAIN_TYPE_MULTIPLIERS = {
  [TRAIN_TYPES.RAJDHANI]: 0.92,
  [TRAIN_TYPES.SHATABDI]: 0.88,
  [TRAIN_TYPES.DURONTO]: 0.85,
  [TRAIN_TYPES.VANDE_BHARAT]: 0.9,
  [TRAIN_TYPES.GARIB_RATH]: 0.95,
  [TRAIN_TYPES.SUPERFAST]: 0.8,
  [TRAIN_TYPES.EXPRESS]: 0.75,
  [TRAIN_TYPES.PASSENGER]: 0.65,
  [TRAIN_TYPES.MAIL]: 0.7,
  [TRAIN_TYPES.INTERCITY]: 0.78,
};

// Coach class occupancy modifiers
const COACH_OCCUPANCY_BASE = {
  "1A": { base: 55, variance: 15 },
  "2A": { base: 68, variance: 18 },
  "3A": { base: 82, variance: 20 },
  SL: { base: 90, variance: 25 },
  GN: { base: 105, variance: 30 }, // Can exceed 100% (overcrowded)
  CC: { base: 72, variance: 20 },
  EC: { base: 60, variance: 15 },
};

// Peak hour multipliers (hour -> multiplier)
const PEAK_HOUR_MULTIPLIERS = {
  0: 0.4,
  1: 0.35,
  2: 0.3,
  3: 0.28,
  4: 0.35,
  5: 0.55,
  6: 0.75,
  7: 0.9,
  8: 1.0,
  9: 0.95,
  10: 0.85,
  11: 0.8,
  12: 0.82,
  13: 0.85,
  14: 0.8,
  15: 0.82,
  16: 0.88,
  17: 0.95,
  18: 1.0,
  19: 0.98,
  20: 0.92,
  21: 0.85,
  22: 0.75,
  23: 0.6,
};

// Day multipliers
const DAY_MULTIPLIERS = {
  Monday: 0.85,
  Tuesday: 0.8,
  Wednesday: 0.82,
  Thursday: 0.85,
  Friday: 1.05,
  Saturday: 1.1,
  Sunday: 1.08,
};

// Festival/holiday periods - months (1-indexed) and typical high periods
const FESTIVAL_PERIODS = [
  { name: "Diwali", months: [10, 11], multiplier: 1.35 },
  { name: "Holi", months: [3], multiplier: 1.25 },
  { name: "Dussehra", months: [10], multiplier: 1.2 },
  { name: "Eid", months: [3, 4, 5, 6], multiplier: 1.3 },
  { name: "Christmas/New Year", months: [12, 1], multiplier: 1.2 },
  { name: "Summer Vacation", months: [5, 6], multiplier: 1.15 },
  { name: "Puja Season", months: [9, 10], multiplier: 1.18 },
];

// Major Indian railway stations
const MAJOR_STATIONS = {
  "New Delhi": { code: "NDLS", city: "Delhi", zone: "NR" },
  "Mumbai Central": { code: "BCT", city: "Mumbai", zone: "WR" },
  Howrah: { code: "HWH", city: "Kolkata", zone: "ER" },
  "Chennai Central": { code: "MAS", city: "Chennai", zone: "SR" },
  Bengaluru: { code: "SBC", city: "Bangalore", zone: "SWR" },
  Hyderabad: { code: "HYB", city: "Hyderabad", zone: "SCR" },
  Pune: { code: "PUNE", city: "Pune", zone: "CR" },
  Jaipur: { code: "JP", city: "Jaipur", zone: "NWR" },
  Lucknow: { code: "LKO", city: "Lucknow", zone: "NER" },
  Ahmedabad: { code: "ADI", city: "Ahmedabad", zone: "WR" },
  Kanpur: { code: "CNB", city: "Kanpur", zone: "NCR" },
  Nagpur: { code: "NGP", city: "Nagpur", zone: "CR" },
  Patna: { code: "PNBE", city: "Patna", zone: "ECR" },
  Bhopal: { code: "BPL", city: "Bhopal", zone: "WCR" },
  Varanasi: { code: "BSB", city: "Varanasi", zone: "NER" },
  Agra: { code: "AGC", city: "Agra", zone: "NCR" },
  Amritsar: { code: "ASR", city: "Amritsar", zone: "NR" },
  Kolkata: { code: "KOAA", city: "Kolkata", zone: "ER" },
  Surat: { code: "ST", city: "Surat", zone: "WR" },
  Coimbatore: { code: "CBE", city: "Coimbatore", zone: "SR" },
};

// Known popular trains with accurate data
const KNOWN_TRAINS = {
  12301: {
    name: "Howrah Rajdhani Express",
    type: TRAIN_TYPES.RAJDHANI,
    source: "Howrah",
    destination: "New Delhi",
    distance: 1446,
    avgOccupancy: 92,
  },
  12302: {
    name: "New Delhi Rajdhani Express",
    type: TRAIN_TYPES.RAJDHANI,
    source: "New Delhi",
    destination: "Howrah",
    distance: 1446,
    avgOccupancy: 91,
  },
  12001: {
    name: "Bhopal Shatabdi Express",
    type: TRAIN_TYPES.SHATABDI,
    source: "New Delhi",
    destination: "Bhopal",
    distance: 705,
    avgOccupancy: 88,
  },
  22439: {
    name: "New Delhi - Ranchi Vande Bharat Express",
    type: TRAIN_TYPES.VANDE_BHARAT,
    source: "New Delhi",
    destination: "Ranchi",
    distance: 1162,
    avgOccupancy: 90,
  },
  12951: {
    name: "Mumbai Rajdhani Express",
    type: TRAIN_TYPES.RAJDHANI,
    source: "Mumbai Central",
    destination: "New Delhi",
    distance: 1384,
    avgOccupancy: 93,
  },
  12259: {
    name: "Sealdah Duronto Express",
    type: TRAIN_TYPES.DURONTO,
    source: "Sealdah",
    destination: "New Delhi",
    distance: 1453,
    avgOccupancy: 87,
  },
  12627: {
    name: "Karnataka Express",
    type: TRAIN_TYPES.SUPERFAST,
    source: "Bengaluru",
    destination: "New Delhi",
    distance: 2444,
    avgOccupancy: 82,
  },
  12621: {
    name: "Tamil Nadu Express",
    type: TRAIN_TYPES.SUPERFAST,
    source: "Chennai Central",
    destination: "New Delhi",
    distance: 2180,
    avgOccupancy: 85,
  },
};

const OCCUPANCY_THRESHOLDS = {
  LOW: 40,
  MODERATE: 65,
  HIGH: 85,
  VERY_HIGH: 95,
  OVERCROWDED: 100,
};

const COMFORT_SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  FAIR: 55,
  POOR: 40,
  VERY_POOR: 0,
};

const SEARCH_TYPES = {
  TRAIN_NUMBER: "TRAIN_NUMBER",
  TRAIN_NAME: "TRAIN_NAME",
  PNR: "PNR",
  COACH: "COACH",
  STATION: "STATION",
  SOURCE: "SOURCE",
  DESTINATION: "DESTINATION",
  UNKNOWN: "UNKNOWN",
};

module.exports = {
  CROWD_LEVELS,
  RISK_LEVELS,
  TRAIN_TYPES,
  COACH_TYPES,
  TRAIN_TYPE_MULTIPLIERS,
  COACH_OCCUPANCY_BASE,
  PEAK_HOUR_MULTIPLIERS,
  DAY_MULTIPLIERS,
  FESTIVAL_PERIODS,
  MAJOR_STATIONS,
  KNOWN_TRAINS,
  OCCUPANCY_THRESHOLDS,
  COMFORT_SCORE_THRESHOLDS,
  SEARCH_TYPES,
};
