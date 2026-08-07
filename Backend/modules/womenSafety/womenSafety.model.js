const mongoose = require("mongoose");

const CompanionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    matchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    coach: {
      type: String,
      trim: true,
    },

    seatNumber: {
      type: String,
      trim: true,
    },

    journeyDate: {
      type: Date,
    },

    trainNumber: {
      type: String,
      trim: true,
    },

    trainName: {
      type: String,
      trim: true,
    },

    sourceStation: {
      type: String,
      trim: true,
    },

    destinationStation: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  }
);

const SafeSeatSchema = new mongoose.Schema(
  {
    coach: {
      type: String,
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
    },

    badge: {
      type: String,
      required: true,
    },

    matchPercentage: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const InsightSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    riskLevel: String,
  },
  {
    _id: false,
  }
);

const WomenSafetySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    safetyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    activeTravelers: {
      type: Number,
      default: 0,
    },

    verifiedTravelers: {
      type: Number,
      default: 0,
    },

    aiMonitoring: {
      type: Boolean,
      default: true,
    },

    safetyAccuracy: {
      type: Number,
      default: 98,
    },

    companions: [CompanionSchema],

    safeSeats: [SafeSeatSchema],

    insight: InsightSchema,

    isEmergencyActive: {
      type: Boolean,
      default: false,
    },

    emergencyRaisedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

WomenSafetySchema.index({
  userId: 1,
});

WomenSafetySchema.index({
  safetyScore: -1,
});

WomenSafetySchema.index({
  "companions.verified": 1,
});

module.exports = mongoose.model(
  "WomenSafety",
  WomenSafetySchema
);