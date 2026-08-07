const { db } = require("../../config/firebase");

const COLLECTION = "womenSafety";

class WomenSafetyRepository {

  /*
  ========================================
  FIND DASHBOARD
  ========================================
  */

  async findByUserId(userId) {

    if (!userId) return null;
    const strUserId = String(userId);

    const doc = await db
      .collection(COLLECTION)
      .doc(strUserId)
      .get();

    console.log("Document Exists:", doc.exists);

    if (doc.exists) {
      console.log("Firestore Data:", doc.data());
      return {
        id: doc.id,
        ...doc.data(),
      };
    }

    const snapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const foundDoc = snapshot.docs[0];
      return {
        id: foundDoc.id,
        ...foundDoc.data(),
      };
    }

    const strSnapshot = await db
      .collection(COLLECTION)
      .where("userId", "==", strUserId)
      .limit(1)
      .get();

    if (!strSnapshot.empty) {
      const foundDoc = strSnapshot.docs[0];
      return {
        id: foundDoc.id,
        ...foundDoc.data(),
      };
    }

    return null;
  }

  /*
  ========================================
  CREATE DASHBOARD
  ========================================
  */

  async create(data) {

    await db
      .collection(COLLECTION)
      .doc(data.userId)
      .set(data);

    return data;
  }

  /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    return {

      safetyScore:
        dashboard.safetyScore,

      verifiedTravelers:
        dashboard.verifiedTravelers,

      activeTravelers:
        dashboard.activeTravelers,

      aiMonitoring:
        dashboard.aiMonitoring,

      safetyAccuracy:
        dashboard.safetyAccuracy,

      companions:
        dashboard.companions || [],

      safeSeats:
        dashboard.safeSeats || [],

      insight:
        dashboard.insight || {},

      isEmergencyActive:
        dashboard.isEmergencyActive,

      emergencyRaisedAt:
        dashboard.emergencyRaisedAt || null

    };
  }

  /*
  ========================================
  SAFETY SCORE
  ========================================
  */

  async getSafetyScore(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    return {

      safetyScore:
        dashboard.safetyScore

    };
  }

  /*
  ========================================
  SAFE SEATS
  ========================================
  */

  async getSafeSeats(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return {

      safeSeats:
        dashboard.safeSeats || []

    };
  }

  /*
  ========================================
  COMPANIONS
  ========================================
  */

  async getCompanions(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return {

      companions:
        dashboard.companions || []

    };
  }

  /*
  ========================================
  VERIFIED COMPANIONS
  ========================================
  */

  async getVerifiedCompanions(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return (
      dashboard.companions || []
    )
      .filter(
        companion =>
          companion.verified === true
      )
      .sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

  }

  /*
  ========================================
  AI INSIGHT
  ========================================
  */

  async getInsight(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    return {

      insight:
        dashboard.insight

    };

  }
    /*
  ========================================
  UPDATE SAFETY SCORE
  ========================================
  */

  async updateSafetyScore(userId, safetyScore) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        safetyScore,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE VERIFIED TRAVELERS
  ========================================
  */

  async updateVerifiedTravelers(userId, verifiedTravelers) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        verifiedTravelers,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE ACTIVE TRAVELERS
  ========================================
  */

  async updateActiveTravelers(userId, activeTravelers) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        activeTravelers,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE AI MONITORING
  ========================================
  */

  async updateMonitoring(userId, aiMonitoring) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        aiMonitoring,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE SAFETY ACCURACY
  ========================================
  */

  async updateSafetyAccuracy(userId, safetyAccuracy) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        safetyAccuracy,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE AI INSIGHT
  ========================================
  */

  async updateInsight(userId, insight) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        insight,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  RAISE EMERGENCY
  ========================================
  */

  async raiseEmergency(userId) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({

        isEmergencyActive: true,

        emergencyRaisedAt: new Date()

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  CLEAR EMERGENCY
  ========================================
  */

  async clearEmergency(userId) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update({

        isEmergencyActive: false

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  EMERGENCY STATUS
  ========================================
  */

  async getEmergencyStatus(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    return {

      isEmergencyActive:
        dashboard.isEmergencyActive,

      emergencyRaisedAt:
        dashboard.emergencyRaisedAt || null

    };

  }

  /*
  ========================================
  DASHBOARD EXISTS
  ========================================
  */

  async dashboardExists(userId) {

    const doc =
      await db.collection(COLLECTION)
      .doc(userId)
      .get();

    return doc.exists;

  }

  /*
  ========================================
  DELETE DASHBOARD
  ========================================
  */

  async deleteDashboard(userId) {

    await db.collection(COLLECTION)
      .doc(userId)
      .delete();

    return true;

  }

  /*
  ========================================
  UPDATE COMPLETE DASHBOARD
  ========================================
  */

  async updateDashboard(userId, payload) {

    await db.collection(COLLECTION)
      .doc(userId)
      .update(payload);

    return await this.findByUserId(userId);

  }
    /*
  ========================================
  ADD COMPANION
  ========================================
  */

  async addCompanion(userId, companion) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) return null;

    const companions =
      dashboard.companions || [];

    companions.push(companion);

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        companions,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE COMPANION
  ========================================
  */

  async updateCompanion(userId, companionId, payload) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) return null;

    const companions =
      dashboard.companions || [];

    const updatedCompanions =
      companions.map((item) => {

        if (item.id === companionId) {
          return {
            ...item,
            ...payload,
          };
        }

        return item;

      });

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        companions: updatedCompanions,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  REMOVE COMPANION
  ========================================
  */

  async removeCompanion(userId, companionId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) return null;

    const companions =
      dashboard.companions || [];

    const filteredCompanions =
      companions.filter(
        item => item.id !== companionId
      );

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        companions: filteredCompanions,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  ADD SAFE SEAT
  ========================================
  */

  async addSafeSeat(userId, seat) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) return null;

    const safeSeats =
      dashboard.safeSeats || [];

    safeSeats.push(seat);

    await db.collection(COLLECTION)
      .doc(userId)
      .update({
        safeSeats,
      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE SAFE SEAT
  ========================================
  */

  async updateSafeSeat(userId, seatId, payload) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) return null;

    const safeSeats =
      dashboard.safeSeats || [];

    const updatedSeats =
      safeSeats.map((seat) => {

        if (seat.id === seatId) {

          return {

            ...seat,

            ...payload,

          };

        }

        return seat;

      });

    await db.collection(COLLECTION)
      .doc(userId)
      .update({

        safeSeats: updatedSeats

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  REMOVE SAFE SEAT
  ========================================
  */

  async removeSafeSeat(userId, seatId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) return null;

    const safeSeats =
      dashboard.safeSeats || [];

    const updatedSeats =
      safeSeats.filter(
        seat => seat.id !== seatId
      );

    await db.collection(COLLECTION)
      .doc(userId)
      .update({

        safeSeats: updatedSeats

      });

    return await this.findByUserId(userId);

  }
    /*
  ========================================
  TOP COMPANIONS
  ========================================
  */

  async getTopCompanions(userId, limit = 5) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return (dashboard.companions || [])
      .sort(
        (a, b) =>
          (b.matchPercentage || 0) -
          (a.matchPercentage || 0)
      )
      .slice(0, limit);

  }

  /*
  ========================================
  DASHBOARD STATISTICS
  ========================================
  */

  async getStatistics(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    return {

      safetyScore:
        dashboard.safetyScore || 0,

      verifiedTravelers:
        dashboard.verifiedTravelers || 0,

      activeTravelers:
        dashboard.activeTravelers || 0,

      safetyAccuracy:
        dashboard.safetyAccuracy || 0,

      companionCount:
        (dashboard.companions || []).length,

      safeSeatCount:
        (dashboard.safeSeats || []).length

    };

  }

  /*
  ========================================
  SEARCH COMPANION
  ========================================
  */

  async searchCompanion(userId, keyword) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    const search =
      keyword.toLowerCase();

    return (dashboard.companions || [])
      .filter(item =>
        item.name
          ?.toLowerCase()
          .includes(search)
      );

  }

  /*
  ========================================
  REPLACE SAFE SEATS
  ========================================
  */

  async replaceSafeSeats(userId, seats) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        safeSeats: seats

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  REPLACE COMPANIONS
  ========================================
  */

  async replaceCompanions(userId, companions) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        companions

      });

    return await this.findByUserId(userId);

  }

}

module.exports =
  new WomenSafetyRepository();