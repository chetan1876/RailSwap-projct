const EmergencyMedicalRepository = require("./emergencyMedical.repository");
const NotificationService = require("../notification/notification.service");
const userRepository = require("../users/user.repository");
const { sendEmail } = require("../../config/mail");
const { messaging } = require("../../config/firebase");
const axios = require("axios");

async function sendMultiChannelEmergencyAlert({
  userId,
  title,
  message,
  type = "EMERGENCY_MEDICAL",
  details = {},
}) {
  console.log(`[MedicalAlert] sendMultiChannelEmergencyAlert triggered. userId=${userId}, type=${type}`);

  try {
    await NotificationService.sendEmergencyNotification(
      userId,
      `[ADMIN ALERT] ${title}`,
      `Emergency Medical triggered by User ID: ${userId}. ${message}`
    );
    console.log("[MedicalAlert] Admin notification logged to Firestore.");
  } catch (err) {
    console.error("[MedicalAlert] Failed to log admin notification:", err.message);
  }

  let user = null;
  try {
    user = await userRepository.findUserById(userId);
    if (user) {
      console.log(`[MedicalAlert] User fetched: ${user.fullName || user.email || userId}`);
    } else {
      console.warn(`[MedicalAlert] User not found in Firestore for userId=${userId}`);
    }
  } catch (err) {
    console.warn("[MedicalAlert] Could not fetch user profile for emergency alert:", err.message);
  }

  const userEmail = user?.email;
  const userName = user?.fullName || "RailSwap User";
  const emergencyEmail = user?.emergencyContact?.email || userEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const emergencyPhone = details?.phoneNumber || details?.phone || details?.mobileNumber || details?.mobile || details?.emergencyPhone || details?.contactPhone || user?.emergencyContact?.phone || user?.phoneNumber || process.env.ADMIN_PHONE;
  const fcmToken = user?.fcmToken;

  // ── EMAIL ALERT ──────────────────────────────────────────────────
  if (emergencyEmail) {
    console.log(`[MedicalAlert] Attempting to send Email alert to: ${emergencyEmail}`);
    try {
      await sendEmail({
        to: emergencyEmail,
        subject: `🚨 MEDICAL EMERGENCY ALERT: ${title}`,
        text: `MEDICAL EMERGENCY ALERT FOR ${userName.toUpperCase()}!\n\n${message}\n\nDetails:\n${JSON.stringify(details, null, 2)}\n\nPlease respond immediately.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #dc2626; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #dc2626; margin-top: 0;">🚨 MEDICAL EMERGENCY ALERT: ${title}</h2>
            <p><strong>Patient Name:</strong> ${details.patientName || userName}</p>
            <p><strong>User ID:</strong> ${userId}</p>
            <p><strong>Alert Details:</strong> ${message}</p>
            <hr style="border: 1px solid #fecaca; margin: 20px 0;" />
            <pre style="background: #f8fafc; padding: 12px; border-radius: 4px;">${JSON.stringify(details, null, 2)}</pre>
            <p style="color: #b91c1c; font-weight: bold;">RailSwap Emergency Medical System</p>
          </div>
        `,
      });
      console.log(`[MedicalAlert] ✅ Email alert sent successfully to: ${emergencyEmail}`);
    } catch (emailErr) {
      console.error(`[MedicalAlert] ❌ Failed to send email alert to ${emergencyEmail}:`, emailErr.stack || emailErr.message || emailErr);
    }
  } else {
    console.warn("[MedicalAlert] No emergency email address available. Email alert skipped.");
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

        const smsMessage = `🚨 RAILSWAP MEDICAL EMERGENCY: ${title} for ${details.patientName || userName}! ${message}`;

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
    console.warn("[MedicalAlert] No emergency phone number available. SMS alert skipped.");
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
      console.log(`[MedicalAlert] ✅ FCM Push notification sent to user device token.`);
    } else if (messaging) {
      await messaging.send({ ...fcmMessage, topic: "emergency_alerts" });
      console.log(`[MedicalAlert] ✅ FCM Push notification broadcasted to 'emergency_alerts' topic.`);
    }
  } catch (fcmErr) {
    console.error("[MedicalAlert] ❌ Failed to send FCM push notification:", fcmErr.message);
  }
}

const {
  dashboardMapper,
  doctorMapper,
  donorMapper,
  insightMapper,
} = require("./emergencyMedical.mapper");

const {
  RESPONSE_STATUS,
  DOCTOR_STATUS,
} = require("./emergencyMedical.constants");

class EmergencyMedicalService {

  /*
  ========================================
  INITIALIZE DASHBOARD
  ========================================
  */

  async initializeDashboard(userId) {

    const dashboardExists =
      await EmergencyMedicalRepository.dashboardExists(
        userId
      );

    if (dashboardExists) {
      return await EmergencyMedicalRepository.findByUserId(
        userId
      );
    }

    const dashboard = {

      userId,

      responseTime: 5,

      doctorsNearby: 18,

      availableDoctors: 12,

      medicalVolunteers: 25,

      emergencySupport: 24,

      doctors: [],

      donors: [],

      insight: {

        title: "AI Medical Insight",

        description:
          "Medical assistance is available within your nearby coaches.",

        riskLevel: "LOW",

      },

      isEmergencyActive: false,

      emergencyRaisedAt: null,

      emergencyData: null,

    };

    return await EmergencyMedicalRepository.create(
      dashboard
    );

  }

  /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard(userId) {

    console.log("Service userId:", userId);

    let dashboard =
      await EmergencyMedicalRepository.getDashboard(
        userId
      );

    console.log("Dashboard From Repository:", dashboard);

    if (!dashboard) {
      console.log("Dashboard not found, initializing dashboard for userId:", userId);
      await this.initializeDashboard(userId);
      dashboard = await EmergencyMedicalRepository.getDashboard(userId);
    }

    if (!dashboard) {

      throw new Error(
        "Emergency Medical Dashboard not found"
      );

    }

    return dashboardMapper(
      dashboard
    );

  }

  /*
  ========================================
  GET RESPONSE TIME
  ========================================
  */

  async getResponseTime(userId) {

    const response =
      await EmergencyMedicalRepository.getResponseTime(
        userId
      );

    if (!response) {

      throw new Error(
        "Response Time not found"
      );

    }

    let status =
      RESPONSE_STATUS.NORMAL;

    if (response.responseTime <= 5) {

      status =
        RESPONSE_STATUS.EXCELLENT;

    } else if (
      response.responseTime <= 10
    ) {

      status =
        RESPONSE_STATUS.GOOD;

    } else if (
      response.responseTime <= 20
    ) {

      status =
        RESPONSE_STATUS.AVERAGE;

    }

    return {

      responseTime:
        response.responseTime,

      status,

    };

  }

  /*
  ========================================
  GET DOCTORS
  ========================================
  */

  async getDoctors(userId) {

    const response =
      await EmergencyMedicalRepository.getDoctors(
        userId
      );

    if (!response) {

      throw new Error(
        "Doctors not found"
      );

    }

    return (response.doctors || [])
      .map(doctorMapper);

  }

  /*
  ========================================
  GET AVAILABLE DOCTORS
  ========================================
  */

  async getAvailableDoctors(userId) {

    const doctors =
      await EmergencyMedicalRepository.getAvailableDoctors(
        userId
      );

    return (doctors || []).map((doctor) => {

      doctor.status =
        doctor.available
          ? DOCTOR_STATUS.AVAILABLE
          : DOCTOR_STATUS.BUSY;

      return doctorMapper(
        doctor
      );

    });

  }

  /*
  ========================================
  GET DONORS
  ========================================
  */

  async getDonors(userId) {

    const response =
      await EmergencyMedicalRepository.getDonors(
        userId
      );

    if (!response) {

      throw new Error(
        "Blood Donors not found"
      );

    }

    return (response.donors || [])
      .map(donorMapper);

  }

  /*
  ========================================
  GET AVAILABLE DONORS
  ========================================
  */

  async getAvailableDonors(userId) {

    const donors =
      await EmergencyMedicalRepository.getAvailableDonors(
        userId
      );

    return (donors || [])
      .map(donorMapper);

  }
    /*
  ========================================
  GET AI INSIGHT
  ========================================
  */

  async getAIInsight(userId) {

    const insight =
      await EmergencyMedicalRepository.getInsight(
        userId
      );

    if (!insight) {

      throw new Error(
        "AI Insight not found"
      );

    }

    return insightMapper(
      insight.insight
    );

  }

  /*
  ========================================
  CONNECT DOCTOR
  ========================================
  */

  async connectDoctor(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    const doctor = {

      id: Date.now().toString(),

      name: payload.name,

      speciality: payload.speciality,

      hospital: payload.hospital,

      coach: payload.coach,

      seatNumber: payload.seatNumber,

      phone: payload.phone,

      experience: payload.experience || 0,

      available: true,

      profileImage:
        payload.profileImage || "",

    };

    const updated =
      await EmergencyMedicalRepository.addDoctor(
        userId,
        doctor
      );

    return doctorMapper(
      updated.doctors[
        updated.doctors.length - 1
      ]
    );

  }

  /*
  ========================================
  CONNECT DONOR
  ========================================
  */

  async connectDonor(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    const donor = {

      id: Date.now().toString(),

      name: payload.name,

      blood: payload.blood,

      coach: payload.coach,

      seatNumber: payload.seatNumber,

      phone: payload.phone,

      verified: true,

      profileImage:
        payload.profileImage || "",

    };

    const updated =
      await EmergencyMedicalRepository.addDonor(
        userId,
        donor
      );

    return donorMapper(
      updated.donors[
        updated.donors.length - 1
      ]
    );

  }

  /*
  ========================================
  DISCONNECT DOCTOR
  ========================================
  */

  async disconnectDoctor(userId, doctorId) {

    const updated =
      await EmergencyMedicalRepository.removeDoctor(
        userId,
        doctorId
      );

    if (!updated) {

      throw new Error(
        "Doctor not found"
      );

    }

    return {

      success: true,

      message:
        "Doctor disconnected successfully.",

    };

  }

  /*
  ========================================
  DISCONNECT DONOR
  ========================================
  */

  async disconnectDonor(userId, donorId) {

    const updated =
      await EmergencyMedicalRepository.removeDonor(
        userId,
        donorId
      );

    if (!updated) {

      throw new Error(
        "Donor not found"
      );

    }

    return {

      success: true,

      message:
        "Blood Donor disconnected successfully.",

    };

  }

  /*
  ========================================
  CALCULATE RESPONSE TIME
  ========================================
  */

  async calculateResponseTime(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    let responseTime = 20;

    responseTime -= Math.min(
      dashboard.availableDoctors || 0,
      10
    );

    responseTime -= Math.min(
      (dashboard.medicalVolunteers || 0) / 5,
      5
    );

    if (
      (dashboard.doctors || []).length >= 3
    ) {

      responseTime -= 3;

    }

    if (
      (dashboard.donors || []).length >= 2
    ) {

      responseTime -= 2;

    }

    if (responseTime < 2) {

      responseTime = 2;

    }

    await EmergencyMedicalRepository.updateResponseTime(
      userId,
      responseTime
    );

    return {

      responseTime,

    };

  }

  /*
  ========================================
  REFRESH RESPONSE TIME
  ========================================
  */

  async refreshResponseTime(userId) {

    await this.calculateResponseTime(
      userId
    );

    return await this.getResponseTime(
      userId
    );

  }
    /*
  ========================================
  GENERATE AI DOCTORS
  ========================================
  */

  async generateAIDoctors(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const doctors = [

      {
        id: "doctor1",
        name: "Dr. Aman Singh",
        speciality: "General Physician",
        hospital: "Railway Medical Team",
        coach: "B2",
        seatNumber: "18",
        phone: "9999999999",
        experience: 8,
        available: true,
        profileImage: "",
      },

      {
        id: "doctor2",
        name: "Dr. Neha Sharma",
        speciality: "Cardiologist",
        hospital: "AIIMS",
        coach: "B3",
        seatNumber: "22",
        phone: "8888888888",
        experience: 10,
        available: true,
        profileImage: "",
      },

      {
        id: "doctor3",
        name: "Dr. Raj Kumar",
        speciality: "Orthopedic",
        hospital: "Apollo",
        coach: "A1",
        seatNumber: "11",
        phone: "7777777777",
        experience: 6,
        available: true,
        profileImage: "",
      },

    ];

    await EmergencyMedicalRepository.replaceDoctors(
      userId,
      doctors
    );

    return doctors.map(
      doctorMapper
    );

  }

  /*
  ========================================
  GENERATE AI DONORS
  ========================================
  */

  async generateAIDonors(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const donors = [

      {
        id: "donor1",
        name: "Rahul Kumar",
        blood: "O+",
        coach: "B2",
        seatNumber: "35",
        phone: "9876543210",
        verified: true,
        profileImage: "",
      },

      {
        id: "donor2",
        name: "Amit Singh",
        blood: "A+",
        coach: "B3",
        seatNumber: "16",
        phone: "9876543211",
        verified: true,
        profileImage: "",
      },

      {
        id: "donor3",
        name: "Priya Sharma",
        blood: "B+",
        coach: "A1",
        seatNumber: "28",
        phone: "9876543212",
        verified: true,
        profileImage: "",
      },

    ];

    await EmergencyMedicalRepository.replaceDonors(
      userId,
      donors
    );

    return donors.map(
      donorMapper
    );

  }

  /*
  ========================================
  RAISE SOS
  ========================================
  */

  async raiseSOS(userId, payload) {

    console.log("SOS received");
    console.log("SOS User ID:", userId);
    console.log("Searching dashboard...");
    let dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );
    console.log("Dashboard Found:", dashboard);

    if (!dashboard) {
      const createdDashboard = await this.initializeDashboard(userId);
      console.log("Dashboard Created:", createdDashboard);
      dashboard = createdDashboard;
    }

    console.log("Continuing SOS process...");

    await EmergencyMedicalRepository.raiseEmergency(
      userId,
      payload
    );

    await sendMultiChannelEmergencyAlert({
      userId,
      title: "Medical Emergency SOS Alert",
      message: `Emergency Medical SOS requested for patient ${payload.patientName || 'Unknown'}, Coach ${payload.coach || 'N/A'}, Seat ${payload.seatNumber || 'N/A'}. Type: ${payload.emergencyType || 'Medical assistance'}.`,
      type: "EMERGENCY_MEDICAL_SOS",
      details: payload,
    });

    return {

      success: true,

      message:
        "Emergency SOS sent successfully.",

      emergency: {

        coach: payload.coach,

        seatNumber: payload.seatNumber,

        emergencyType: payload.emergencyType,

        patientName: payload.patientName,

        message:
          payload.message || "",

        latitude:
          payload.latitude || null,

        longitude:
          payload.longitude || null,

        raisedAt:
          new Date(),

      },

    };

  }

  /*
  ========================================
  CONTACT DOCTOR
  ========================================
  */

  async contactDoctor(userId, payload) {

    let dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      dashboard = await this.initializeDashboard(userId);
    }

    await sendMultiChannelEmergencyAlert({
      userId,
      title: "Doctor Contact Request",
      message: `Doctor request initiated for patient ${payload.patientName || 'Unknown'}. Doctor ID: ${payload.doctorId || 'N/A'}. Emergency Type: ${payload.emergencyType || 'Medical assistance'}.`,
      type: "DOCTOR_REQUEST",
      details: payload,
    });

    return {

      success: true,

      message:
        "Doctor notified successfully.",

      data: {

        doctorId:
          payload.doctorId,

        patientName:
          payload.patientName,

        emergencyType:
          payload.emergencyType,

        status:
          "REQUEST_SENT",

        createdAt:
          new Date(),

      },

    };

  }

  /*
  ========================================
  CONTACT MEDICAL HELPLINE
  ========================================
  */

  async contactHelpline(userId, payload) {

    let dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      dashboard = await this.initializeDashboard(userId);
    }

    await sendMultiChannelEmergencyAlert({
      userId,
      title: "Medical Helpline Request",
      message: `Medical Helpline requested for issue: ${payload.issue || 'Medical Emergency'}. Phone: ${payload.phoneNumber || 'N/A'}.`,
      type: "MEDICAL_HELPLINE",
      details: payload,
    });

    return {

      success: true,

      message:
        "Medical Helpline Connected.",

      data: {

        issue:
          payload.issue,

        phoneNumber:
          payload.phoneNumber,

        status:
          "CONNECTED",

        createdAt:
          new Date(),

      },

    };

  }

  /*
  ========================================
  GENERATE AI INSIGHT
  ========================================
  */

  async generateAIInsight(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    let description =
      "Medical team is available nearby. Response time is excellent.";

    if (dashboard.responseTime > 10) {

      description =
        "Response time is increasing. AI recommends contacting the nearest doctor immediately.";

    }

    const insight = {

      title:
        "AI Medical Insight",

      description,

      riskLevel:
        dashboard.responseTime <= 5
          ? "LOW"
          : dashboard.responseTime <= 10
          ? "MEDIUM"
          : "HIGH",

    };

    await EmergencyMedicalRepository.updateInsight(
      userId,
      insight
    );

    return insight;

  }
    /*
  ========================================
  REFRESH DASHBOARD
  ========================================
  */

  async refreshDashboard(userId) {

    await this.calculateResponseTime(
      userId
    );

    await this.generateAIDoctors(
      userId
    );

    await this.generateAIDonors(
      userId
    );

    await this.generateAIInsight(
      userId
    );

    return await this.getDashboard(
      userId
    );

  }

  /*
  ========================================
  GET EMERGENCY STATUS
  ========================================
  */

  async getEmergencyStatus(userId) {

    const status =
      await EmergencyMedicalRepository.getEmergencyStatus(
        userId
      );

    if (!status) {

      throw new Error(
        "Dashboard not found"
      );

    }

    return status;

  }

  /*
  ========================================
  REFRESH DOCTORS
  ========================================
  */

  async refreshDoctors(userId) {

    await this.generateAIDoctors(
      userId
    );

    return await this.getAvailableDoctors(
      userId
    );

  }

  /*
  ========================================
  REFRESH DONORS
  ========================================
  */

  async refreshDonors(userId) {

    await this.generateAIDonors(
      userId
    );

    return await this.getAvailableDonors(
      userId
    );

  }

  /*
  ========================================
  RESET DASHBOARD
  ========================================
  */

  async resetDashboard(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    await EmergencyMedicalRepository.updateDashboard(
      userId,
      {

        responseTime: 0,

        doctorsNearby: 0,

        availableDoctors: 0,

        medicalVolunteers: 0,

        emergencySupport: 24,

        doctors: [],

        donors: [],

        insight: {

          title: "",

          description: "",

          riskLevel: "LOW",

        },

        isEmergencyActive: false,

        emergencyRaisedAt: null,

        emergencyData: null,

      }
    );

    return await this.getDashboard(
      userId
    );

  }

  /*
  ========================================
  DELETE DASHBOARD
  ========================================
  */

  async deleteDashboard(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    await EmergencyMedicalRepository.deleteDashboard(
      userId
    );

    return {

      success: true,

      message:
        "Emergency Medical Dashboard deleted successfully.",

    };

  }

}

module.exports =
  new EmergencyMedicalService();