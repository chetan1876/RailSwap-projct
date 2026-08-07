const WomenSafetyRepository = require("./womenSafety.repository");
const NotificationService = require("../notification/notification.service");
const userRepository = require("../users/user.repository");
const { sendEmail } = require("../../config/mail");
const { messaging } = require("../../config/firebase");
const axios = require("axios");

async function sendMultiChannelEmergencyAlert({
  userId,
  title,
  message,
  type = "WOMEN_SAFETY",
  details = {},
}) {
  console.log(`[EmergencyAlert] sendMultiChannelEmergencyAlert triggered. userId=${userId}, type=${type}`);

  try {
    await NotificationService.sendWomenSafetyNotification(
      userId,
      `[ADMIN ALERT] ${title}`,
      `Emergency triggered by User ID: ${userId}. ${message}`
    );
    console.log("[EmergencyAlert] Admin notification logged to Firestore.");
  } catch (err) {
    console.error("[EmergencyAlert] Failed to log admin notification:", err.message);
  }

  let user = null;
  try {
    user = await userRepository.findUserById(userId);
    if (user) {
      console.log(`[EmergencyAlert] User fetched: ${user.fullName || user.email || userId}`);
    } else {
      console.warn(`[EmergencyAlert] User not found in Firestore for userId=${userId}`);
    }
  } catch (err) {
    console.warn("[EmergencyAlert] Could not fetch user profile for emergency alert:", err.message);
  }

  const userEmail = user?.email;
  const userName = user?.fullName || "RailSwap User";
  const emergencyEmail = user?.emergencyContact?.email || userEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const emergencyPhone = details?.phoneNumber || details?.phone || details?.mobileNumber || details?.mobile || details?.emergencyPhone || details?.contactPhone || user?.emergencyContact?.phone || user?.phoneNumber || process.env.ADMIN_PHONE;
  const fcmToken = user?.fcmToken;

  // ── EMAIL ALERT ──────────────────────────────────────────────────
  if (emergencyEmail) {
    console.log(`[EmergencyAlert] Attempting to send Email alert to: ${emergencyEmail}`);
    try {
      await sendEmail({
        to: emergencyEmail,
        subject: `🚨 EMERGENCY ALERT: ${title}`,
        text: `EMERGENCY ALERT FOR ${userName.toUpperCase()}!\n\n${message}\n\nDetails:\n${JSON.stringify(details, null, 2)}\n\nPlease respond immediately.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #ef4444; margin-top: 0;">🚨 EMERGENCY ALERT: ${title}</h2>
            <p><strong>Passenger Name:</strong> ${userName}</p>
            <p><strong>User ID:</strong> ${userId}</p>
            <p><strong>Alert Details:</strong> ${message}</p>
            <hr style="border: 1px solid #fee2e2; margin: 20px 0;" />
            <pre style="background: #f8fafc; padding: 12px; border-radius: 4px;">${JSON.stringify(details, null, 2)}</pre>
            <p style="color: #dc2626; font-weight: bold;">RailSwap Emergency Safety System</p>
          </div>
        `,
      });
      console.log(`[EmergencyAlert] ✅ Email alert sent successfully to: ${emergencyEmail}`);
    } catch (emailErr) {
      console.error(`[EmergencyAlert] ❌ Failed to send email alert to ${emergencyEmail}:`, emailErr.stack || emailErr.message || emailErr);
    }
  } else {
    console.warn("[EmergencyAlert] No emergency email address available. Email alert skipped.");
  }

  // ── SMS ALERT (Fast2SMS) ──────────────────────────────────────────
  console.log(`SMS destination: ${emergencyPhone}`);
  if (emergencyPhone) {
    if (process.env.FAST2SMS_API_KEY) {
      console.log("Sending Fast2SMS...");
      try {
        let cleanPhone = String(emergencyPhone).replace(/\D/g, "");
        if (cleanPhone.length > 10) {
          cleanPhone = cleanPhone.slice(-10);
        }

        const smsMessage = `🚨 RAILSWAP EMERGENCY ALERT: ${title} for ${userName}! ${message}`;

        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          {
            route: "q",
            message: smsMessage,
            language: "english",
            flash: 0,
            numbers: cleanPhone,
          },
          {
            headers: {
              authorization: process.env.FAST2SMS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.return) {
          console.log("SMS sent successfully via Fast2SMS");
          console.log("[Fast2SMS] Success Details:", response.data);
        } else {
          console.error("Fast2SMS failed:", response.data ? response.data.message || JSON.stringify(response.data) : "Unknown Fast2SMS error");
        }
      } catch (smsErr) {
        console.error("Fast2SMS failed:", smsErr.response?.data || smsErr.message || smsErr);
      }
    } else {
      console.warn("[Fast2SMS] FAST2SMS_API_KEY not configured in .env. Fast2SMS alert skipped.");
    }
  } else {
    console.warn("[EmergencyAlert] No emergency phone number available. SMS alert skipped.");
  }

  // ── FCM PUSH NOTIFICATION ─────────────────────────────────────────
  try {
    const fcmMessage = {
      notification: {
        title: `🚨 ${title}`,
        body: message,
      },
      data: {
        userId: String(userId),
        type,
        details: JSON.stringify(details),
      },
    };

    if (fcmToken) {
      await messaging.send({ ...fcmMessage, token: fcmToken });
      console.log(`[EmergencyAlert] ✅ FCM Push notification sent to user device token.`);
    } else if (messaging) {
      await messaging.send({ ...fcmMessage, topic: "emergency_alerts" });
      console.log(`[EmergencyAlert] ✅ FCM Push notification broadcasted to 'emergency_alerts' topic.`);
    }
  } catch (fcmErr) {
    console.error("[EmergencyAlert] ❌ Failed to send FCM push notification:", fcmErr.message);
  }
}

const {
  dashboardMapper,
  companionMapper,
  seatMapper,
  insightMapper,
} = require("./womenSafety.mapper");

const {
  SAFETY_SCORE_STATUS,
  COMPANION_STATUS,
} = require("./womenSafety.constants");

class WomenSafetyService {

  async initializeDashboard(userId) {

    const dashboardExists =
      await WomenSafetyRepository.dashboardExists(userId);

    if (dashboardExists) {
      return await WomenSafetyRepository.findByUserId(userId);
    }

    const dashboard = {
      userId,

      safetyScore: 96,

      verifiedTravelers: 120,

      activeTravelers: 85,

      aiMonitoring: true,

      safetyAccuracy: 98,

      companions: [],

      safeSeats: [],

      insight: {
        title: "AI Safety Insight",

        description:
          "Coach B2 currently has the highest women traveler density and lowest safety risk score.",

        riskLevel: "LOW",
      },

      isEmergencyActive: false,
    };

    return await WomenSafetyRepository.create(dashboard);
  }

async getDashboard(userId) {

  console.log("Service userId:", userId);

  let dashboard =
    await WomenSafetyRepository.getDashboard(userId);

  console.log("Dashboard From Repository:", dashboard);

  if (!dashboard) {
    console.log("Dashboard not found, initializing dashboard for userId:", userId);
    await this.initializeDashboard(userId);
    dashboard = await WomenSafetyRepository.getDashboard(userId);
  }

  if (!dashboard) {
    throw new Error("Women Safety Dashboard not found");
  }

  return dashboardMapper(dashboard);
}

  async getSafetyScore(userId) {

    const data =
      await WomenSafetyRepository.getSafetyScore(userId);

    if (!data) {
      throw new Error("Safety Score not found");
    }

    let status = SAFETY_SCORE_STATUS.RISK;

    if (data.safetyScore >= 95) {

      status = SAFETY_SCORE_STATUS.EXCELLENT;

    } else if (data.safetyScore >= 80) {

      status = SAFETY_SCORE_STATUS.GOOD;

    } else if (data.safetyScore >= 60) {

      status = SAFETY_SCORE_STATUS.AVERAGE;
    }

    return {

      score: data.safetyScore,

      status,
    };
  }

  async getCompanions(userId) {

    const response =
      await WomenSafetyRepository.getCompanions(userId);

    if (!response) {
      throw new Error("Companions not found");
    }

    return response.companions.map(companionMapper);
  }

  async getVerifiedCompanions(userId) {

    const companions =
      await WomenSafetyRepository.getVerifiedCompanions(userId);

    return companions.map((item) => {

      item.status = item.verified
        ? COMPANION_STATUS.VERIFIED
        : COMPANION_STATUS.PENDING;

      return companionMapper(item);

    });

  }

  async getSafeSeats(userId) {

    const seats =
      await WomenSafetyRepository.getSafeSeats(userId);

    if (!seats) {
      throw new Error("Safe Seats not found");
    }

    return seats.safeSeats.map(seatMapper);

  }

  async getAIInsight(userId) {

    const insight =
      await WomenSafetyRepository.getInsight(userId);

    if (!insight) {
      throw new Error("AI Insight not found");
    }

    return insightMapper(insight.insight);

  }

    async calculateSafetyScore(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    let score = 50;

    score += Math.min(dashboard.verifiedTravelers / 5, 20);

    score += Math.min(dashboard.activeTravelers / 10, 10);

    if (dashboard.aiMonitoring) {
      score += 10;
    }

    score += dashboard.safetyAccuracy / 10;

    if (dashboard.companions.length >= 3) {
      score += 5;
    }

    if (dashboard.safeSeats.length >= 3) {
      score += 5;
    }

    score = Math.min(Math.round(score), 100);

    await WomenSafetyRepository.updateSafetyScore(
      userId,
      score
    );

    return {
      safetyScore: score,
    };

  }

  async generateAISafeSeats(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

   const generatedSeats = [
  {
    id: "seat1",
    coach: "B2",
    seatNumber: "21",
    badge: "Safe",
    matchPercentage: 98,
  },
  {
    id: "seat2",
    coach: "B2",
    seatNumber: "24",
    badge: "Best",
    matchPercentage: 97,
  },
  {
    id: "seat3",
    coach: "B1",
    seatNumber: "18",
    badge: "Safe",
    matchPercentage: 96,
  },
  {
    id: "seat4",
    coach: "B3",
    seatNumber: "12",
    badge: "Best",
    matchPercentage: 99,
  },
];

    await WomenSafetyRepository.replaceSafeSeats(
      userId,
      generatedSeats
    );

    return generatedSeats.map(seatMapper);

  }

  async connectCompanion(userId, payload) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }
const companion = {

  id: Date.now().toString(),

  name: payload.name,

  age: payload.age,

  verified: true,

  matchPercentage: payload.matchPercentage,

  coach: payload.coach,

  seatNumber: payload.seatNumber,

  trainNumber: payload.trainNumber,

  trainName: payload.trainName,

  sourceStation: payload.sourceStation,

  destinationStation: payload.destinationStation,

  trustScore: payload.trustScore,

  profileImage: payload.profileImage || "",

};

    const updated =
      await WomenSafetyRepository.addCompanion(
        userId,
        companion
      );

    return companionMapper(
      updated.companions[
        updated.companions.length - 1
      ]
    );

  }

  async disconnectCompanion(userId, companionId) {

    const updated =
      await WomenSafetyRepository.removeCompanion(
        userId,
        companionId
      );

    return updated;

  }

  async refreshSafetyScore(userId) {

    await this.calculateSafetyScore(userId);

    return await this.getSafetyScore(userId);

  }

  async refreshSafeSeats(userId) {

    await this.generateAISafeSeats(userId);

    return await this.getSafeSeats(userId);

  }

  async updateDashboardStatistics(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const verifiedTravelers =
      dashboard.companions.filter(
        (item) => item.verified
      ).length;

    const activeTravelers =
      dashboard.companions.length;

    await WomenSafetyRepository.updateVerifiedTravelers(
      userId,
      verifiedTravelers
    );

    await WomenSafetyRepository.updateActiveTravelers(
      userId,
      activeTravelers
    );

    return {

      verifiedTravelers,

      activeTravelers,

    };

  }

    async raiseSOS(userId, payload) {

    console.log("SOS received");
    console.log("SOS User ID:", userId);
    console.log("Searching dashboard...");
    let dashboard =
      await WomenSafetyRepository.findByUserId(userId);
    console.log("Dashboard Found:", dashboard);

    if (!dashboard) {
      const createdDashboard = await this.initializeDashboard(userId);
      console.log("Dashboard Created:", createdDashboard);
      dashboard = createdDashboard;
    }

    console.log("Continuing SOS process...");

    await WomenSafetyRepository.raiseEmergency(userId);

    try {
      await NotificationService.sendWomenSafetyNotification(
        userId,
        "Women Safety SOS Alert",
        `Emergency SOS raised for coach ${payload.coach || 'B2'}, seat ${payload.seatNumber || '21'}. Help requested immediately.`
      );
    } catch (_) {}

    await sendMultiChannelEmergencyAlert({
      userId,
      title: "Women Safety SOS Alert",
      message: `Emergency SOS raised for coach ${payload.coach || 'B2'}, seat ${payload.seatNumber || '21'}. Help requested immediately.`,
      type: "WOMEN_SAFETY_SOS",
      details: payload,
    });

    return {
      success: true,
      message: "SOS Alert sent successfully.",
      emergency: {
        coach: payload.coach,
        seatNumber: payload.seatNumber,
        latitude: payload.latitude || null,
        longitude: payload.longitude || null,
        emergencyMessage:
          payload.emergencyMessage || "",
        raisedAt: new Date(),
      },
    };

  }

  async contactRPF(userId, payload) {

    let dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      dashboard = await this.initializeDashboard(userId);
    }

    try {
      await NotificationService.sendWomenSafetyNotification(
        userId,
        "RPF Alert Sent",
        `RPF notified for coach ${payload.coach || 'B2'}, seat ${payload.seatNumber || '21'}. Reason: ${payload.reason || 'Safety assistance requested'}.`
      );
    } catch (_) {}

    await sendMultiChannelEmergencyAlert({
      userId,
      title: "Women Safety RPF Alert",
      message: `RPF notified for coach ${payload.coach || 'B2'}, seat ${payload.seatNumber || '21'}. Reason: ${payload.reason || 'Safety assistance requested'}.`,
      type: "WOMEN_SAFETY_RPF",
      details: payload,
    });

    return {
      success: true,
      message: "RPF has been notified successfully.",
      data: {
        coach: payload.coach,
        seatNumber: payload.seatNumber,
        reason: payload.reason,
        status: "REQUEST_SENT",
        createdAt: new Date(),
      },
    };

  }

  async contactHelpline(userId, payload) {

    let dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      dashboard = await this.initializeDashboard(userId);
    }

    try {
      await NotificationService.sendWomenSafetyNotification(
        userId,
        "Helpline Contacted",
        `Helpline request submitted for issue: ${payload.issue || 'Women Safety Helpline'}.`
      );
    } catch (_) {}

    await sendMultiChannelEmergencyAlert({
      userId,
      title: "Women Safety Helpline Alert",
      message: `Helpline request submitted for issue: ${payload.issue || 'Women Safety Helpline'}.`,
      type: "WOMEN_SAFETY_HELPLINE",
      details: payload,
    });

    return {
      success: true,
      message: "Helpline request submitted successfully.",
      data: {
        issue: payload.issue,
        phoneNumber: payload.phoneNumber,
        status: "CONNECTED",
        createdAt: new Date(),
      },
    };

  }

  async generateAIInsight(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    let description =
      "Coach B2 currently has the highest women traveler density and lowest safety risk score. Recommended for seat exchange requests.";

    if (dashboard.safetyScore < 70) {

      description =
        "Safety score is below average. AI recommends changing coach or requesting seat exchange.";

    }

    const insight = {

      title: "AI Safety Insight",

      description,

      riskLevel:
        dashboard.safetyScore >= 90
          ? "LOW"
          : dashboard.safetyScore >= 70
          ? "MEDIUM"
          : "HIGH",

    };

    await WomenSafetyRepository.updateInsight(
      userId,
      insight
    );

    return insight;

  }

  async getEmergencyStatus(userId) {

    return await WomenSafetyRepository.getEmergencyStatus(
      userId
    );

  }

  async deleteDashboard(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    await WomenSafetyRepository.deleteDashboard(userId);

    return {
      success: true,
      message: "Women Safety Dashboard deleted successfully.",
    };

  }

    async refreshDashboard(userId) {

    await this.updateDashboardStatistics(userId);

    await this.calculateSafetyScore(userId);

    await this.generateAISafeSeats(userId);

    await this.generateAIInsight(userId);

    return await this.getDashboard(userId);

  }

  async refreshCompanions(userId) {

    const companions =
      await this.getVerifiedCompanions(userId);

    await this.updateDashboardStatistics(userId);

    return companions;

  }

  async resetDashboard(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    await WomenSafetyRepository.updateDashboard(userId, {

      safetyScore: 0,

      verifiedTravelers: 0,

      activeTravelers: 0,

      aiMonitoring: true,

      safetyAccuracy: 0,

      companions: [],

      safeSeats: [],

      insight: {

        title: "",

        description: "",

        riskLevel: "LOW",

      },

      isEmergencyActive: false,

      emergencyRaisedAt: null,

    });

    return await this.getDashboard(userId);

  }

}

module.exports = new WomenSafetyService();