"use strict";

const { db } = require("../../config/firebase");

const COLLECTION = "journeyGroups";

const createGroup = async (groupData) => {
  const docRef = await db.collection(COLLECTION).add(groupData);

  return {
    id: docRef.id,
    ...groupData,
  };
};

const getGroups = async () => {
  const snapshot = await db.collection(COLLECTION).get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const joinGroup = async (groupId, user) => {
  const docRef = db.collection(COLLECTION).doc(groupId);

  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Group not found");
  }

  const group = doc.data();

  const members = group.members || [];

  members.push(user);

  await docRef.update({
    members,
  });

  return {
    id: groupId,
    ...group,
    members,
  };
};

module.exports = {
  createGroup,
  getGroups,
  joinGroup,
};
