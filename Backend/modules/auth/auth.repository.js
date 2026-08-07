const { db } = require("../../config/firebase");

const COLLECTION = "users";
const userCollection = db ? db.collection(COLLECTION) : null;

// In-memory fallback user store for offline / unauthenticated Firestore environments
const inMemoryUsers = new Map();

/* =====================================================
                    CREATE USER
===================================================== */

const createUser = async (userData) => {
  const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const userRecord = {
    uid,
    ...userData,
  };

  try {
    if (userCollection) {
      const docRef = userCollection.doc();
      const firestoreUser = {
        uid: docRef.id,
        ...userData,
      };
      await docRef.set(firestoreUser);
      inMemoryUsers.set(docRef.id, firestoreUser);
      if (userData.email) {
        inMemoryUsers.set(userData.email.toLowerCase(), firestoreUser);
      }
      return firestoreUser;
    }
  } catch (error) {
    console.warn("Firestore createUser fallback to memory store:", error.message);
  }

  inMemoryUsers.set(uid, userRecord);
  if (userData.email) {
    inMemoryUsers.set(userData.email.toLowerCase(), userRecord);
  }
  return userRecord;
};

/* =====================================================
                GET USER BY UID
===================================================== */

const getUserByUID = async (uid) => {
  try {
    if (userCollection) {
      const snapshot = await userCollection
        .where("uid", "==", uid)
        .limit(1)
        .get();

      if (!snapshot.empty) return snapshot.docs[0].data();
    }
  } catch (error) {
    console.warn("Firestore getUserByUID fallback to memory store:", error.message);
  }

  return inMemoryUsers.get(uid) || null;
};

/* =====================================================
                GET USER BY EMAIL
===================================================== */

const getUserByEmail = async (email) => {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    if (userCollection) {
      const snapshot = await userCollection
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get();

      if (!snapshot.empty) return snapshot.docs[0].data();
    }
  } catch (error) {
    console.warn("Firestore getUserByEmail fallback to memory store:", error.message);
  }

  // Check in-memory store by email or values
  if (inMemoryUsers.has(normalizedEmail)) {
    return inMemoryUsers.get(normalizedEmail);
  }

  for (const u of inMemoryUsers.values()) {
    if (u.email && u.email.toLowerCase() === normalizedEmail) {
      return u;
    }
  }

  return null;
};

/* =====================================================
                SAVE OTP
===================================================== */

const saveOTP = async (uid, otp, otpExpiry) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        otp,
        otpExpiry,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore saveOTP fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.otp = otp;
    u.otpExpiry = otpExpiry;
    u.updatedAt = new Date();
  }
};

/* =====================================================
            SAVE RESET OTP
===================================================== */

const saveResetOTP = async (uid, resetOTP, resetOTPExpiry) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        resetOTP,
        resetOTPExpiry,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore saveResetOTP fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.resetOTP = resetOTP;
    u.resetOTPExpiry = resetOTPExpiry;
    u.updatedAt = new Date();
  }
};

/* =====================================================
                VERIFY EMAIL
===================================================== */

const verifyEmail = async (uid) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        emailVerified: true,
        status: "ACTIVE",
        otp: null,
        otpExpiry: null,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore verifyEmail fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.emailVerified = true;
    u.status = "ACTIVE";
    u.otp = null;
    u.otpExpiry = null;
    u.updatedAt = new Date();
  }
};

/* =====================================================
            UPDATE LOGIN INFO
===================================================== */

const updateLoginInfo = async (uid, refreshToken, lastLogin) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        refreshToken,
        lastLogin,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore updateLoginInfo fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.refreshToken = refreshToken;
    u.lastLogin = lastLogin;
    u.updatedAt = new Date();
  }
};

/* =====================================================
            REMOVE REFRESH TOKEN
===================================================== */

const removeRefreshToken = async (uid) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        refreshToken: null,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore removeRefreshToken fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.refreshToken = null;
    u.updatedAt = new Date();
  }
};

/* =====================================================
                UPDATE PASSWORD
===================================================== */

const updatePassword = async (uid, password) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        password,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore updatePassword fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.password = password;
    u.updatedAt = new Date();
  }
};

/* =====================================================
            CLEAR RESET OTP
===================================================== */

const clearResetOTP = async (uid) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).update({
        resetOTP: null,
        resetOTPExpiry: null,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore clearResetOTP fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u) {
    u.resetOTP = null;
    u.resetOTPExpiry = null;
    u.updatedAt = new Date();
  }
};

/* =====================================================
                DELETE USER
===================================================== */

const deleteUser = async (uid) => {
  try {
    if (userCollection) {
      await userCollection.doc(uid).delete();
    }
  } catch (error) {
    console.warn("Firestore deleteUser fallback to memory store:", error.message);
  }

  const u = inMemoryUsers.get(uid);
  if (u && u.email) {
    inMemoryUsers.delete(u.email.toLowerCase());
  }
  inMemoryUsers.delete(uid);
};

module.exports = {
  createUser,
  getUserByUID,
  getUserByEmail,
  saveOTP,
  saveResetOTP,
  verifyEmail,
  updateLoginInfo,
  removeRefreshToken,
  updatePassword,
  clearResetOTP,
  deleteUser,
};