const express = require("express");

const router = express.Router();


const NotificationController =
  require("./notification.controller");

const {
  initializeNotificationValidation,
  createNotificationValidation,
  getNotificationValidation,
  getAllNotificationsValidation,
  markAsReadValidation,
  deleteNotificationValidation,
} = require("./notification.validation");

const validate =
  require("../../middleware/validation.middleware");

const authMiddleware =
  require("../../middleware/auth.middleware");

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

/*
========================================
INITIALIZE NOTIFICATIONS
========================================
*/

router.get(
  "/:userId/initialize",
  authMiddleware,
  validate(initializeNotificationValidation),
  NotificationController.initializeNotifications
);

/*
========================================
CREATE NOTIFICATION
========================================
*/

router.post(
  "/",
  authMiddleware,
  validate(createNotificationValidation),
  NotificationController.createNotification
);

/*
========================================
GET ALL NOTIFICATIONS
========================================
*/

router.get(
  "/:userId",
  authMiddleware,
  validate(getAllNotificationsValidation),
  NotificationController.getAllNotifications
);

/*
========================================
GET UNREAD NOTIFICATIONS
========================================
*/

router.get(
  "/:userId/unread",
  authMiddleware,
  validate(getAllNotificationsValidation),
  NotificationController.getUnreadNotifications
);

/*
========================================
GET NOTIFICATION COUNT
========================================
*/

router.get(
  "/:userId/count",
  authMiddleware,
  validate(getAllNotificationsValidation),
  NotificationController.getNotificationCount
);

/*
========================================
GET SINGLE NOTIFICATION
========================================
*/

router.get(
  "/details/:notificationId",
  authMiddleware,
  validate(getNotificationValidation),
  NotificationController.getNotification
);
/*
========================================
MARK NOTIFICATION AS READ
========================================
*/

router.patch(
  "/:notificationId/read",
  authMiddleware,
  validate(markAsReadValidation),
  NotificationController.markAsRead
);

/*
========================================
MARK ALL NOTIFICATIONS AS READ
========================================
*/

router.patch(
  "/:userId/read-all",
  authMiddleware,
  validate(getAllNotificationsValidation),
  NotificationController.markAllAsRead
);

/*
========================================
DELETE NOTIFICATION
========================================
*/

router.delete(
  "/:notificationId",
  authMiddleware,
  validate(deleteNotificationValidation),
  NotificationController.deleteNotification
);

/*
========================================
DELETE ALL NOTIFICATIONS
========================================
*/

router.delete(
  "/:userId/all",
  authMiddleware,
  validate(getAllNotificationsValidation),
  NotificationController.deleteAllNotifications
);

/*
========================================
EXPORT ROUTER
========================================
*/

const notificationController = require("./notification.controller");

// =====================================================
// SAVE FCM TOKEN
// =====================================================

router.post(
  "/save-token",
  notificationController.saveFCMToken
);

// =====================================================
// GET USER FCM TOKEN
// =====================================================

router.get(
  "/token/:userId",
  notificationController.getUserFCMToken
);

// =====================================================
// DELETE FCM TOKEN
// =====================================================

router.delete(
  "/token/:userId",
  notificationController.deleteFCMToken
);

// =====================================================
// EXPORT
// =====================================================


module.exports = router;