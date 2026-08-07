const admin = require("firebase-admin");
const { db } = require("../../config/firebase");

/*
========================================
COLLECTION
========================================
*/

const COLLECTION = "notifications";

class NotificationRepository {

  /*
  ========================================
  CREATE NOTIFICATION
  ========================================
  */

  async create(data) {

    const docRef =
      db.collection(COLLECTION).doc();

    const notification = {

      id: docRef.id,

      userId: data.userId,

      title: data.title,

      message: data.message,

      type: data.type,

      priority: data.priority,

      sourceModule: data.sourceModule,

      isRead: false,

      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),

      updatedAt:
        admin.firestore.FieldValue.serverTimestamp(),

    };

    await docRef.set(notification);

    return await this.findById(
      docRef.id
    );

  }

  /*
  ========================================
  FIND NOTIFICATION BY ID
  ========================================
  */

  async findById(notificationId) {

    const doc =
      await db
        .collection(COLLECTION)
        .doc(notificationId)
        .get();

    if (!doc.exists) {

      return null;

    }

    return {

      id: doc.id,

      ...doc.data(),

    };

  }

  /*
  ========================================
  CHECK NOTIFICATION EXISTS
  ========================================
  */

  async exists(notificationId) {

    const doc =
      await db
        .collection(COLLECTION)
        .doc(notificationId)
        .get();

    return doc.exists;

  }

  /*
  ========================================
  FIND USER NOTIFICATIONS
  ========================================
  */

  async findByUserId(userId) {

    try {
      const snapshot =
        await db
          .collection(COLLECTION)
          .where(
            "userId",
            "==",
            userId
          )
          .orderBy(
            "createdAt",
            "desc"
          )
          .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (err) {
      const snapshot =
        await db
          .collection(COLLECTION)
          .where(
            "userId",
            "==",
            userId
          )
          .get();

      if (snapshot.empty) {
        return [];
      }

      const docs = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      return docs.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });
    }

  }

  /*
  ========================================
  GET ALL NOTIFICATIONS
  ========================================
  */

  async getAll(userId) {

    return await this.findByUserId(
      userId
    );

  }

  /*
  ========================================
  GET UNREAD NOTIFICATIONS
  ========================================
  */

  async getUnread(userId) {

    try {
      const snapshot =
        await db
          .collection(COLLECTION)
          .where(
            "userId",
            "==",
            userId
          )
          .where(
            "isRead",
            "==",
            false
          )
          .orderBy(
            "createdAt",
            "desc"
          )
          .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (err) {
      const snapshot =
        await db
          .collection(COLLECTION)
          .where(
            "userId",
            "==",
            userId
          )
          .where(
            "isRead",
            "==",
            false
          )
          .get();

      if (snapshot.empty) {
        return [];
      }

      const docs = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      return docs.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });
    }

  }
    /*
  ========================================
  GET UNREAD COUNT
  ========================================
  */

  async getCount(userId) {

    const unreadNotifications =
      await this.getUnread(userId);

    return {

      total:
        unreadNotifications.length,

    };

  }

  /*
  ========================================
  MARK NOTIFICATION AS READ
  ========================================
  */

  async markAsRead(notificationId) {

    const exists =
      await this.exists(notificationId);

    if (!exists) {

      return null;

    }

    await db
      .collection(COLLECTION)
      .doc(notificationId)
      .update({

        isRead: true,

        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),

      });

    return await this.findById(
      notificationId
    );

  }

  /*
  ========================================
  MARK ALL NOTIFICATIONS AS READ
  ========================================
  */

  async markAllAsRead(userId) {

    const notifications =
      await this.getUnread(userId);

    if (
      notifications.length === 0
    ) {

      return [];

    }

    const batch =
      db.batch();

    notifications.forEach(
      (notification) => {

        const ref =
          db
            .collection(COLLECTION)
            .doc(notification.id);

        batch.update(ref, {

          isRead: true,

          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),

        });

      }
    );

    await batch.commit();

    return await this.findByUserId(
      userId
    );

  } 
    /*
  ========================================
  DELETE NOTIFICATION
  ========================================
  */

  async delete(notificationId) {

    const exists =
      await this.exists(notificationId);

    if (!exists) {

      return false;

    }

    await db
      .collection(COLLECTION)
      .doc(notificationId)
      .delete();

    return true;

  }

  /*
  ========================================
  DELETE ALL NOTIFICATIONS
  ========================================
  */

  async deleteAll(userId) {

    const notifications =
      await this.findByUserId(userId);

    if (
      notifications.length === 0
    ) {

      return true;

    }

    const batch =
      db.batch();

    notifications.forEach(
      (notification) => {

        const ref =
          db
            .collection(COLLECTION)
            .doc(notification.id);

        batch.delete(ref);

      }
    );

    await batch.commit();

    return true;

  }

  /*
  ========================================
  GET LATEST NOTIFICATION
  ========================================
  */

  async getLatest(userId) {

    const snapshot =
      await db
        .collection(COLLECTION)
        .where(
          "userId",
          "==",
          userId
        )
        .orderBy(
          "createdAt",
          "desc"
        )
        .limit(1)
        .get();

    if (snapshot.empty) {

      return null;

    }

    const doc =
      snapshot.docs[0];

    return {

      id: doc.id,

      ...doc.data(),

    };

  }
   }

/*
========================================
EXPORT REPOSITORY
========================================
*/

module.exports = new NotificationRepository();