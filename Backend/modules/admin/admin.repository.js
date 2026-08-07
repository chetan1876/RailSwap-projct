const { db } = require("../../config/firebase");

const {
  ADMIN_COLLECTION,
  ADMIN_STATUS,
} = require("./admin.constants");

class AdminRepository {

  /*
  ========================================
  FIND ADMIN BY ID
  ========================================
  */

  async findById(adminId) {

    const doc = await db
      .collection(ADMIN_COLLECTION)
      .doc(adminId)
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
  ADMIN EXISTS
  ========================================
  */

  async adminExists(adminId) {

    const admin = await this.findById(
      adminId
    );

    return !!admin;

  }

  /*
  ========================================
  CREATE ADMIN
  ========================================
  */

  async create(data) {

    await db
      .collection(ADMIN_COLLECTION)
      .doc(data.id)
      .set({

        ...data,

        createdAt: new Date(),

        updatedAt: new Date(),

      });

    return await this.findById(
      data.id
    );

  }

  /*
  ========================================
  GET PROFILE
  ========================================
  */

  async getProfile(adminId) {

    return await this.findById(
      adminId
    );

  }

  /*
  ========================================
  UPDATE PROFILE
  ========================================
  */

  async update(adminId, payload) {

    await db
      .collection(ADMIN_COLLECTION)
      .doc(adminId)
      .update({

        ...payload,

        updatedAt: new Date(),

      });

    return await this.findById(
      adminId
    );

  }

  /*
  ========================================
  DELETE ADMIN
  ========================================
  */

  async delete(adminId) {

    await db
      .collection(ADMIN_COLLECTION)
      .doc(adminId)
      .delete();

    return true;

  }

    /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard() {

    return {

      totalUsers:
        await this.countUsers(),

      activeUsers:
        await this.countActiveUsers(),

      blockedUsers:
        await this.countBlockedUsers(),

      totalSeatExchangeRequests:
        await this.countSeatExchangeRequests(),

      totalJourneyCompanions:
        await this.countJourneyCompanions(),

      totalWomenSafetyAlerts:
        await this.countWomenSafetyAlerts(),

      totalEmergencyCases:
        await this.countEmergencyCases(),

      totalNotifications:
        await this.countNotifications(),

      totalAdmins:
        await this.countAdmins(),

    };

  }

  /*
  ========================================
  TOTAL USERS
  ========================================
  */

  async countUsers() {

    const snapshot = await db
      .collection("users")
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  ACTIVE USERS
  ========================================
  */

  async countActiveUsers() {

    const snapshot = await db
      .collection("users")
      .where(
        "status",
        "==",
        ADMIN_STATUS.ACTIVE
      )
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  BLOCKED USERS
  ========================================
  */

  async countBlockedUsers() {

    const snapshot = await db
      .collection("users")
      .where(
        "status",
        "==",
        ADMIN_STATUS.BLOCKED
      )
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  TOTAL ADMINS
  ========================================
  */

  async countAdmins() {

    const snapshot = await db
      .collection(ADMIN_COLLECTION)
      .get();

    return snapshot.size;

  }
    /*
  ========================================
  TOTAL SEAT EXCHANGE REQUESTS
  ========================================
  */

  async countSeatExchangeRequests() {

    const snapshot = await db
      .collection("seatExchange")
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  TOTAL JOURNEY COMPANIONS
  ========================================
  */

  async countJourneyCompanions() {

    const snapshot = await db
      .collection("journeyCompanion")
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  TOTAL WOMEN SAFETY ALERTS
  ========================================
  */

  async countWomenSafetyAlerts() {

    const snapshot = await db
      .collection("womenSafety")
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  TOTAL EMERGENCY MEDICAL CASES
  ========================================
  */

  async countEmergencyCases() {

    const snapshot = await db
      .collection("emergencyMedical")
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  TOTAL NOTIFICATIONS
  ========================================
  */

  async countNotifications() {

    const snapshot = await db
      .collectionGroup("notifications")
      .get();

    return snapshot.size;

  }

  /*
  ========================================
  GET ALL USERS
  ========================================
  */

  async getUsers() {

    const snapshot = await db
      .collection("users")
      .get();

    return snapshot.docs.map(doc => ({

      id: doc.id,

      ...doc.data(),

    }));

  }

  /*
  ========================================
  GET USER BY ID
  ========================================
  */

  async getUser(userId) {

    const doc = await db
      .collection("users")
      .doc(userId)
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
  BLOCK USER
  ========================================
  */

  async blockUser(userId) {

    await db
      .collection("users")
      .doc(userId)
      .update({

        status: ADMIN_STATUS.BLOCKED,

        updatedAt: new Date(),

      });

    return await this.getUser(userId);

  }

  /*
  ========================================
  UNBLOCK USER
  ========================================
  */

  async unblockUser(userId) {

    await db
      .collection("users")
      .doc(userId)
      .update({

        status: ADMIN_STATUS.ACTIVE,

        updatedAt: new Date(),

      });

    return await this.getUser(userId);

  }

  /*
  ========================================
  DELETE USER
  ========================================
  */

  async deleteUser(userId) {

    await db
      .collection("users")
      .doc(userId)
      .delete();

    return true;

  }

}

module.exports = new AdminRepository();