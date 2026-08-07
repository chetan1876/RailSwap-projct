import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyByqCbQP---5ZqNsIi9JOzA-v8H0PgZKcI",
  authDomain: "railswap-fd18a.firebaseapp.com",
  projectId: "railswap-fd18a",
  storageBucket: "railswap-fd18a.firebasestorage.app",
  messagingSenderId: "105796061275",
  appId: "1:105796061275:web:491084f3d42348e0d4d77e",
};

// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

// =====================================================
// API URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// FIREBASE MESSAGING
// =====================================================

let messaging = null;

const initializeMessaging = async () => {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.warn(
        "Firebase Messaging is not supported in this browser."
      );
      return null;
    }

    if (!messaging) {
      messaging = getMessaging(app);
    }

    return messaging;
  } catch (error) {
    console.error(
      "Firebase Messaging Initialization Error:",
      error
    );
    return null;
  }
};

// =====================================================
// SAVE FCM TOKEN TO BACKEND
// =====================================================

const saveTokenToBackend = async (userId, fcmToken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/notifications/save-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token: fcmToken,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save FCM token"
      );
    }

    console.log("✅ FCM Token saved:", data);

    return data;
  } catch (error) {
    console.error("❌ Save FCM Token Error:", error);
    return null;
  }
};

// =====================================================
// REQUEST NOTIFICATION PERMISSION
// =====================================================

export const requestNotificationPermission = async (
  userId = "user123"
) => {
  try {
    if (!("Notification" in window)) {
      console.warn(
        "This browser does not support notifications."
      );
      return null;
    }

    const permission =
      await Notification.requestPermission();

    console.log(
      "Notification Permission:",
      permission
    );

    if (permission !== "granted") {
      console.warn(
        "Notification permission was not granted."
      );
      return null;
    }

    const messagingInstance =
      await initializeMessaging();

    if (!messagingInstance) {
      return null;
    }

    const fcmToken = await getToken(
      messagingInstance,
      {
        vapidKey:
          "BONqmDf5iErlHfvQN5Ua-RLLg_LdRhzXOs3asioZhqVlzENomRPAiGw_V9z5IDksP_zzJcA_sYg2dPnnCQbj-qU",
      }
    );

    if (!fcmToken) {
      console.warn(
        "FCM Token could not be generated."
      );
      return null;
    }

    console.log(
      "🔥 FCM Token Generated:",
      fcmToken
    );

    await saveTokenToBackend(userId, fcmToken);

    return fcmToken;
  } catch (error) {
    console.error("❌ FCM Token Error:", error);
    return null;
  }
};

// =====================================================
// LISTEN FOR FOREGROUND MESSAGES
// =====================================================

export const listenForMessages = async (
  callback
) => {
  try {
    const messagingInstance =
      await initializeMessaging();

    if (!messagingInstance) {
      return () => {};
    }

    const unsubscribe = onMessage(
      messagingInstance,
      (payload) => {
        console.log(
          "📩 Foreground Notification Received:",
          payload
        );

        if (callback) {
          callback(payload);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error(
      "❌ Foreground Message Error:",
      error
    );
    return () => {};
  }
};

// =====================================================
// EXPORT FIREBASE APP
// =====================================================

export default app;