const { db } = require("../../config/firebase");

const COLLECTION = "users";

/*
========================================
CREATE USER
========================================
*/

const createUser = async (userData) => {
  const docRef = userData.id
    ? db.collection(COLLECTION).doc(String(userData.id))
    : db.collection(COLLECTION).doc();

  const user = {
    ...userData,
    id: docRef.id,
    createdAt: userData.createdAt || new Date(),
    updatedAt: new Date(),
  };

  await docRef.set(user);
  return user;
};

/*
========================================
FIND USER BY ID
========================================
*/

const findUserById = async (userId) => {
  if (!userId) return null;
  const doc = await db
    .collection(COLLECTION)
    .doc(String(userId))
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};

/*
========================================
FIND USER BY EMAIL
========================================
*/

const findUserByEmail = async (email) => {
  if (!email) return null;
  const snapshot = await db
    .collection(COLLECTION)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get();

  if (snapshot.empty) {
    const altSnapshot = await db
      .collection(COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (altSnapshot.empty) {
      return null;
    }

    const doc = altSnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
};

/*
========================================
FIND USER BY PHONE
========================================
*/

const findUserByPhone = async (phoneNumber) => {
  if (!phoneNumber) return null;
  const snapshot = await db
    .collection(COLLECTION)
    .where("phoneNumber", "==", phoneNumber)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
};

/*
========================================
UPDATE USER BY ID
========================================
*/

const updateUserById = async (userId, updateData) => {
  if (!userId) return null;
  const docRef = db.collection(COLLECTION).doc(String(userId));
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const dataToUpdate = {
    ...updateData,
    updatedAt: new Date(),
  };

  await docRef.update(dataToUpdate);
  const updatedDoc = await docRef.get();
  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  };
};

/*
========================================
DELETE USER BY ID
========================================
*/

const deleteUserById = async (userId) => {
  if (!userId) return null;
  const docRef = db.collection(COLLECTION).doc(String(userId));
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const data = {
    id: doc.id,
    ...doc.data(),
  };

  await docRef.delete();
  return data;
};

/*
========================================
SAVE USER DOCUMENT
========================================
*/

const saveUser = async (user) => {
  if (!user || !user.id) return null;
  await db
    .collection(COLLECTION)
    .doc(String(user.id))
    .set(user, { merge: true });
  return user;
};

/*
========================================
FIND USER WITH PASSWORD
========================================
*/

const findUserWithPassword = async (email) => {
  return await findUserByEmail(email);
};

/*
========================================
FIND USER FOR PASSWORD RESET
========================================
*/

const findUserByResetToken = async (token) => {
  if (!token) return null;
  const snapshot = await db
    .collection(COLLECTION)
    .where("passwordResetToken", "==", token)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
};

/*
========================================
GET ALL USERS
(Admin)
========================================
*/

const getAllUsers = async (page = 1, limit = 10) => {
  const snapshot = await db.collection(COLLECTION).get();
  const allDocs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  allDocs.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  const total = allDocs.length;
  const skip = (page - 1) * limit;
  const users = allDocs.slice(skip, skip + limit);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByPhone,
  updateUserById,
  deleteUserById,
  saveUser,
  findUserWithPassword,
  findUserByResetToken,
  getAllUsers,
};