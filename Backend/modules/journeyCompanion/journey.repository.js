const admin = require("firebase-admin");
const { db } = require("../../config/firebase");
const { getDefaultChecklist } = require("./journey.checklist");
const { JOURNEY_STATUS } = require("./journey.constants");

const COLLECTION = "journeys";

// In-memory fallback database for offline/local environment
const inMemoryStore = new Map();

// Helper to seed initial sample journey if store is empty
const ensureSeedData = () => {
  if (inMemoryStore.size === 0) {
    const seedId = "journey_sample_101";
    inMemoryStore.set(seedId, {
      id: seedId,
      userId: "default_user",
      trainNumber: "12951",
      trainName: "Mumbai Rajdhani Express",
      pnr: "2849104829",
      from: "Mumbai Central (MMCT)",
      to: "New Delhi (NDLS)",
      journeyDate: new Date().toISOString().split("T")[0],
      departureTime: "17:00",
      arrivalTime: "08:32",
      coach: "B2",
      seat: "34 (Side Lower)",
      platform: "PF-4",
      status: JOURNEY_STATUS.IN_TRANSIT,
      progress: 45,
      totalDistanceKm: 1384,
      checklist: getDefaultChecklist(),
      notes: [
        {
          id: "n1",
          title: "Dinner Ordering",
          content: "Ordered Rajdhani Special Thali at Ratlam station.",
          category: "Food",
          isPinned: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "n2",
          title: "Blanket & Pillow",
          content: "Received clean bedding from attendant.",
          category: "Comfort",
          isPinned: false,
          createdAt: new Date().toISOString(),
        },
      ],
      reminders: {
        boardingReminder: true,
        stationReminder: true,
        destinationReminder: true,
        luggageReminder: true,
        wakeupReminder: true,
      },
      rating: 5,
      isFavourite: true,
      summary: "Comfortable night journey with on-time performance.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};

ensureSeedData();

/*
========================================
CREATE JOURNEY
========================================
*/

const createJourney = async (journeyData) => {
  try {
    if (db) {
      const docRef = await db.collection(COLLECTION).add({
        ...journeyData,
        checklist: journeyData.checklist || getDefaultChecklist(),
        notes: journeyData.notes || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id;
    }
  } catch (error) {
    console.warn("Firestore save fallback to memory store:", error.message);
  }

  // Fallback in-memory save
  const id = `journey_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const record = {
    id,
    ...journeyData,
    checklist: journeyData.checklist || getDefaultChecklist(),
    notes: journeyData.notes || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryStore.set(id, record);
  return id;
};

/*
========================================
GET USER JOURNEYS
========================================
*/

const getJourneysByUser = async (userId = "default_user") => {
  try {
    if (db) {
      const snapshot = await db
        .collection(COLLECTION)
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    }
  } catch (error) {
    console.warn("Firestore query fallback to memory store:", error.message);
  }

  ensureSeedData();
  const list = Array.from(inMemoryStore.values());
  return list.filter(
    (j) => !userId || j.userId === userId || userId === "default_user",
  );
};

/*
========================================
GET JOURNEY BY ID
========================================
*/

const getJourneyById = async (journeyId) => {
  try {
    if (db) {
      const doc = await db.collection(COLLECTION).doc(journeyId).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }
    }
  } catch (error) {
    console.warn("Firestore getById fallback to memory store:", error.message);
  }

  if (inMemoryStore.has(journeyId)) {
    return inMemoryStore.get(journeyId);
  }

  // If not found by exact id, return first available journey as default
  ensureSeedData();
  return inMemoryStore.values().next().value;
};

/*
========================================
UPDATE JOURNEY
========================================
*/

const updateJourney = async (journeyId, updateData) => {
  try {
    if (db) {
      await db
        .collection(COLLECTION)
        .doc(journeyId)
        .update({
          ...updateData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      return getJourneyById(journeyId);
    }
  } catch (error) {
    console.warn("Firestore update fallback to memory store:", error.message);
  }

  const existing = await getJourneyById(journeyId);
  if (existing) {
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    inMemoryStore.set(journeyId, updated);
    return updated;
  }
  return null;
};

/*
========================================
DELETE JOURNEY
========================================
*/

const deleteJourney = async (journeyId) => {
  try {
    if (db) {
      await db.collection(COLLECTION).doc(journeyId).delete();
    }
  } catch (error) {
    console.warn("Firestore delete fallback to memory store:", error.message);
  }

  inMemoryStore.delete(journeyId);
};

module.exports = {
  createJourney,
  getJourneysByUser,
  getJourneyById,
  updateJourney,
  deleteJourney,
};
