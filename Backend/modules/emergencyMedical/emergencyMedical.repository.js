const { db } = require("../../config/firebase");

const COLLECTION = "emergencyMedical";

class EmergencyMedicalRepository {

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
  DASHBOARD EXISTS
  ========================================
  */

  async dashboardExists(userId) {

    const doc = await db
      .collection(COLLECTION)
      .doc(userId)
      .get();

    return doc.exists;

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

      responseTime:
        dashboard.responseTime,

      doctorsNearby:
        dashboard.doctorsNearby,

      availableDoctors:
        dashboard.availableDoctors,

      medicalVolunteers:
        dashboard.medicalVolunteers,

      emergencySupport:
        dashboard.emergencySupport,

      doctors:
        dashboard.doctors || [],

      donors:
        dashboard.donors || [],

      insight:
        dashboard.insight || {},

      isEmergencyActive:
        dashboard.isEmergencyActive,

      emergencyRaisedAt:
        dashboard.emergencyRaisedAt || null,

      emergencyData:
        dashboard.emergencyData || null,

    };

  }

  /*
  ========================================
  GET RESPONSE TIME
  ========================================
  */

  async getResponseTime(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    return {

      responseTime:
        dashboard.responseTime,

    };

  }

  /*
  ========================================
  UPDATE RESPONSE TIME
  ========================================
  */

  async updateResponseTime(userId, responseTime) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        responseTime,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  GET AI INSIGHT
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
        dashboard.insight,

    };

  }

  /*
  ========================================
  UPDATE AI INSIGHT
  ========================================
  */

  async updateInsight(userId, insight) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        insight,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE COMPLETE DASHBOARD
  ========================================
  */

  async updateDashboard(userId, payload) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update(payload);

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  DELETE DASHBOARD
  ========================================
  */

  async deleteDashboard(userId) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .delete();

    return true;

  }
    /*
  ========================================
  GET DOCTORS
  ========================================
  */

  async getDoctors(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {

      return {

        doctors: [],

      };

    }

    return {

      doctors:
        dashboard.doctors || [],

    };

  }

  /*
  ========================================
  ADD DOCTOR
  ========================================
  */

  async addDoctor(userId, doctor) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    const doctors =
      dashboard.doctors || [];

    doctors.push(doctor);

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        doctors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE DOCTOR
  ========================================
  */

  async updateDoctor(userId, doctorId, payload) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    const doctors =
      dashboard.doctors || [];

    const updatedDoctors =
      doctors.map((doctor) => {

        if (doctor.id === doctorId) {

          return {

            ...doctor,

            ...payload,

          };

        }

        return doctor;

      });

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        doctors: updatedDoctors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  REMOVE DOCTOR
  ========================================
  */

  async removeDoctor(userId, doctorId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    const doctors =
      dashboard.doctors || [];

    const updatedDoctors =
      doctors.filter(
        doctor => doctor.id !== doctorId
      );

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        doctors: updatedDoctors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  GET AVAILABLE DOCTORS
  ========================================
  */

  async getAvailableDoctors(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return (dashboard.doctors || []).filter(

      doctor => doctor.available === true

    );

  }

  /*
  ========================================
  REPLACE DOCTORS
  ========================================
  */

  async replaceDoctors(userId, doctors) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        doctors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  SEARCH DOCTOR
  ========================================
  */

  async searchDoctor(userId, keyword) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    keyword =
      keyword.toLowerCase();

    return (dashboard.doctors || []).filter(

      doctor =>

        doctor.name
          ?.toLowerCase()
          .includes(keyword)

        ||

        doctor.speciality
          ?.toLowerCase()
          .includes(keyword)

    );

  }
    /*
  ========================================
  GET DONORS
  ========================================
  */

  async getDonors(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {

      return {

        donors: [],

      };

    }

    return {

      donors:
        dashboard.donors || [],

    };

  }

  /*
  ========================================
  ADD DONOR
  ========================================
  */

  async addDonor(userId, donor) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    const donors =
      dashboard.donors || [];

    donors.push(donor);

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        donors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE DONOR
  ========================================
  */

  async updateDonor(userId, donorId, payload) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    const donors =
      dashboard.donors || [];

    const updatedDonors =
      donors.map((donor) => {

        if (donor.id === donorId) {

          return {

            ...donor,

            ...payload,

          };

        }

        return donor;

      });

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        donors: updatedDonors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  REMOVE DONOR
  ========================================
  */

  async removeDonor(userId, donorId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return null;
    }

    const donors =
      dashboard.donors || [];

    const updatedDonors =
      donors.filter(
        donor => donor.id !== donorId
      );

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        donors: updatedDonors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  GET AVAILABLE DONORS
  ========================================
  */

  async getAvailableDonors(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return (dashboard.donors || []).filter(

      donor => donor.verified === true

    );

  }

  /*
  ========================================
  REPLACE DONORS
  ========================================
  */

  async replaceDonors(userId, donors) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        donors,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  SEARCH DONOR
  ========================================
  */

  async searchDonor(userId, bloodGroup) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return [];
    }

    return (dashboard.donors || []).filter(

      donor => donor.blood === bloodGroup

    );

  }
    /*
  ========================================
  RAISE EMERGENCY
  ========================================
  */

  async raiseEmergency(userId, emergencyData) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        isEmergencyActive: true,

        emergencyRaisedAt: new Date(),

        emergencyData,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  CLEAR EMERGENCY
  ========================================
  */

  async clearEmergency(userId) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        isEmergencyActive: false,

        emergencyRaisedAt: null,

        emergencyData: null,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  GET EMERGENCY STATUS
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
        dashboard.emergencyRaisedAt || null,

      emergencyData:
        dashboard.emergencyData || null,

    };

  }

  /*
  ========================================
  UPDATE EMERGENCY DATA
  ========================================
  */

  async updateEmergencyData(userId, payload) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        emergencyData: payload,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  UPDATE EMERGENCY STATUS
  ========================================
  */

  async updateEmergencyStatus(userId, status) {

    await db
      .collection(COLLECTION)
      .doc(userId)
      .update({

        isEmergencyActive: status,

      });

    return await this.findByUserId(userId);

  }

  /*
  ========================================
  GET ACTIVE EMERGENCY
  ========================================
  */

  async getActiveEmergency(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (
      !dashboard ||
      !dashboard.isEmergencyActive
    ) {
      return null;
    }

    return {

      isEmergencyActive:
        dashboard.isEmergencyActive,

      emergencyRaisedAt:
        dashboard.emergencyRaisedAt,

      emergencyData:
        dashboard.emergencyData,

    };

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

      responseTime:
        dashboard.responseTime || 0,

      doctorsNearby:
        dashboard.doctorsNearby || 0,

      availableDoctors:
        dashboard.availableDoctors || 0,

      medicalVolunteers:
        dashboard.medicalVolunteers || 0,

      emergencySupport:
        dashboard.emergencySupport || 0,

      doctorCount:
        (dashboard.doctors || []).length,

      donorCount:
        (dashboard.donors || []).length,

      emergencyActive:
        dashboard.isEmergencyActive || false,

    };

  }

  /*
  ========================================
  TOTAL DOCTORS
  ========================================
  */

  async getDoctorCount(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return 0;
    }

    return (
      dashboard.doctors || []
    ).length;

  }

  /*
  ========================================
  TOTAL DONORS
  ========================================
  */

  async getDonorCount(userId) {

    const dashboard =
      await this.findByUserId(userId);

    if (!dashboard) {
      return 0;
    }

    return (
      dashboard.donors || []
    ).length;

  }

  /*
  ========================================
  TOTAL AVAILABLE DOCTORS
  ========================================
  */

  async getAvailableDoctorCount(userId) {

    const doctors =
      await this.getAvailableDoctors(userId);

    return doctors.length;

  }

  /*
  ========================================
  TOTAL VERIFIED DONORS
  ========================================
  */

  async getVerifiedDonorCount(userId) {

    const donors =
      await this.getAvailableDonors(userId);

    return donors.length;

  }

}

module.exports =
  new EmergencyMedicalRepository();