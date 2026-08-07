const { db } = require("../../config/firebase");

// Find PNR by Number
const findPNRByNumber = async (pnr) => {
  const snapshot = await db
    .collection("pnr")
    .where("pnr", "==", pnr)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data();
};

// Create New PNR
const createPNR = async (pnrData) => {
  const docRef = await db.collection("pnr").add(pnrData);

  return {
    id: docRef.id,
    ...pnrData,
  };
};

// Get All PNRs
const getAllPNRs = async () => {
  const snapshot = await db.collection("pnr").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Delete PNR
const deletePNR = async (pnr) => {
  const snapshot = await db
    .collection("pnr")
    .where("pnr", "==", pnr)
    .get();

  if (snapshot.empty) {
    return null;
  }

  await snapshot.docs[0].ref.delete();

  return true;
};

module.exports = {
  findPNRByNumber,
  createPNR,
  getAllPNRs,
  deletePNR,
};