require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// =========================
// ROUTES
// =========================

const authRoutes = require("../modules/auth/auth.routes");
const pnrRoutes = require("../modules/pnr/pnr.routes");
const seatExchangeRoutes = require("../modules/seatExchange/seatExchange.routes");
const womenSafetyRoutes = require("../modules/womenSafety/womenSafety.routes");
const emergencyMedicalRoutes = require("../modules/emergencyMedical/emergencyMedical.routes");
const chatbotRoutes = require("../modules/chatbot/chatbot.routes");
const aiRecommendationRoutes = require("../modules/aiRecommendation/aiRecommendation.routes");
const journeyRoutes = require("../modules/journeyCompanion/journey.routes");
const crowdPredictionRoutes = require("../modules/crowdPrediction/crowdPrediction.routes");
const lostItemRoutes = require("../modules/lostItem/lostItem.routes");
const projectRecordRoutes = require("../modules/projectRecord/projectRecord.routes");

const app = express();

/* =====================================================
                    MIDDLEWARE
===================================================== */

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://rail-swap-project.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman ya server-to-server requests ke liye
      if (!origin) return callback(null, true);

      // Exact match
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Vercel preview deployments allow
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

/* =====================================================
                    HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RailSwap Backend Running Successfully 🚀",
  });
});

/* =====================================================
                    API ROUTES
===================================================== */

app.use("/api/auth", authRoutes);

app.use("/api/pnr", pnrRoutes);

app.use("/api/seat-exchange", seatExchangeRoutes);

app.use("/api/women-safety", womenSafetyRoutes);

app.use("/api/emergency-medical", emergencyMedicalRoutes);

app.use("/api/chatbot", chatbotRoutes);

app.use("/api/ai-recommendation", aiRecommendationRoutes);

app.use("/api/journey", journeyRoutes);

app.use("/api/crowd-prediction", crowdPredictionRoutes);

app.use("/api/lost-items", lostItemRoutes);

app.use("/api/project-records", projectRecordRoutes);

/* =====================================================
                    404 HANDLER
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* =====================================================
                GLOBAL ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;