const { db } = require("../../config/firebase");

// Create Lost Item Request
const createLostItem = async (payload) => {
  const docRef = await db.collection("lostItems").add({
    ...payload,
    status: payload.status || "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    id: docRef.id,
    ...payload,
    status: payload.status || "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Get All / My Lost Items
const getLostItems = async (pnr = null) => {
  try {
    let query = db.collection("lostItems");
    if (pnr) {
      query = query.where("pnr", "==", pnr);
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort in memory by createdAt descending
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  } catch (err) {
    console.warn("Lost items fetch error:", err.message);
    return [];
  }
};

// Get Lost Item By ID
const getLostItemById = async (id) => {
  const doc = await db.collection("lostItems").doc(id).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Update Lost Item Status
const updateLostItemStatus = async (id, status) => {
  const allowedStatuses = ["Pending", "Found", "Verified", "Returned"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status update");
  }

  await db.collection("lostItems").doc(id).update({
    status: status,
    updatedAt: new Date().toISOString(),
  });

  return await getLostItemById(id);
};

module.exports = {
  createLostItem,
  getLostItems,
  getLostItemById,
  updateLostItemStatus,
};
