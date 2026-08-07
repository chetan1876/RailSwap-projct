importScripts(
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyByqCbQP---5ZqNsIi9JOzA-v8H0PgZKcI",
  authDomain: "railswap-fd18a.firebaseapp.com",
  projectId: "railswap-fd18a",
  storageBucket: "railswap-fd18a.firebasestorage.app",
  messagingSenderId: "105796061275",
  appId: "1:105796061275:web:491084f3d42438e0d4d77e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Notification:", payload);

  const notificationTitle =
    payload.notification?.title ||
    "RailSwap Notification";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new notification.",
    icon: "/favicon.svg",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});