"use strict";

const admin = require("../../config/firebase");

const { db } = require("../../config/firebase");

const COLLECTION = "crowdPredictions";

/*
========================================
SAVE CROWD PREDICTION
========================================
*/

const savePrediction = async (prediction) => {
  const doc = await db.collection(COLLECTION).add(prediction);

  return {
    id: doc.id,
    ...prediction,
  };
};

/*
========================================
GET ALL PREDICTIONS
========================================
*/

const getPredictions = async () => {
  const snapshot = await db.collection(COLLECTION).get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/*
========================================
GET BY TRAIN NUMBER
========================================
*/

const getPredictionByTrain = async (trainNumber) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("trainNumber", "==", trainNumber)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

module.exports = {
  savePrediction,
  getPredictions,
  getPredictionByTrain,
};
