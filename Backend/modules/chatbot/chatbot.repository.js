"use strict";

const { db } = require("../../config/firebase");
const { COLLECTIONS } = require("./chatbot.constants");

const sessionCollection = db ? db.collection(COLLECTIONS.SESSIONS) : null;
const messageCollection = db ? db.collection(COLLECTIONS.MESSAGES) : null;

// In-memory fallback stores for offline / unauthenticated Firestore environments
const inMemorySessions = new Map();
const inMemoryMessages = new Map();

/**
 * Helper to safely extract milliseconds from Firestore timestamp / Date / serialized object.
 */
const getMillis = (val) => {
  if (!val) return 0;
  if (typeof val.toDate === "function") return val.toDate().getTime();
  if (val.seconds !== undefined) {
    return val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1000000);
  }
  if (val._seconds !== undefined) {
    return val._seconds * 1000 + Math.floor((val._nanoseconds || 0) / 1000000);
  }
  return new Date(val).getTime();
};

/*
========================================
CREATE CHAT SESSION
========================================
*/
const createSession = async (userId, title = "New Chat") => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const session = {
    id: sessionId,
    userId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    if (sessionCollection) {
      const sessionRef = sessionCollection.doc();
      const firestoreSession = {
        ...session,
        id: sessionRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await sessionRef.set(firestoreSession);
      inMemorySessions.set(sessionRef.id, firestoreSession);
      return firestoreSession;
    }
  } catch (error) {
    console.warn("Firestore createSession fallback to memory:", error.message);
  }

  inMemorySessions.set(sessionId, session);
  return session;
};

/*
========================================
GET SESSION
========================================
*/
const getSession = async (sessionId) => {
  try {
    if (sessionCollection) {
      const doc = await sessionCollection.doc(sessionId).get();
      if (doc.exists) return doc.data();
    }
  } catch (error) {
    console.warn("Firestore getSession fallback to memory:", error.message);
  }
  return inMemorySessions.get(sessionId) || null;
};

/*
========================================
SAVE MESSAGE
========================================
*/
const saveMessage = async (sessionId, role, content) => {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const message = {
    id: msgId,
    sessionId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };

  try {
    if (messageCollection) {
      const messageRef = messageCollection.doc();
      const firestoreMsg = {
        ...message,
        id: messageRef.id,
        createdAt: new Date(),
      };
      await messageRef.set(firestoreMsg);
      await sessionCollection.doc(sessionId).update({
        updatedAt: new Date(),
      }).catch(() => {});
      inMemoryMessages.set(messageRef.id, firestoreMsg);
      return firestoreMsg;
    }
  } catch (error) {
    console.warn("Firestore saveMessage fallback to memory:", error.message);
  }

  inMemoryMessages.set(msgId, message);
  const sess = inMemorySessions.get(sessionId);
  if (sess) {
    sess.updatedAt = new Date().toISOString();
  }
  return message;
};

/*
========================================
GET CHAT MESSAGES
========================================
*/
const getMessages = async (sessionId) => {
  try {
    if (messageCollection) {
      const snapshot = await messageCollection
        .where("sessionId", "==", sessionId)
        .get();

      if (!snapshot.empty) {
        const messages = snapshot.docs.map((doc) => doc.data());
        messages.sort((a, b) => getMillis(a.createdAt) - getMillis(b.createdAt));
        return messages;
      }
    }
  } catch (error) {
    console.warn("Firestore getMessages fallback to memory:", error.message);
  }

  const list = Array.from(inMemoryMessages.values()).filter((m) => m.sessionId === sessionId);
  list.sort((a, b) => getMillis(a.createdAt) - getMillis(b.createdAt));
  return list;
};

/*
========================================
GET USER SESSIONS
========================================
*/
const getSessions = async (userId) => {
  try {
    if (sessionCollection) {
      const snapshot = await sessionCollection.where("userId", "==", userId).get();

      if (!snapshot.empty) {
        const sessions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        sessions.sort((a, b) => {
          const aTime = getMillis(a.updatedAt || a.createdAt);
          const bTime = getMillis(b.updatedAt || b.createdAt);
          return bTime - aTime;
        });

        return sessions;
      }
    }
  } catch (error) {
    console.warn("Firestore getSessions fallback to memory:", error.message);
  }

  const list = Array.from(inMemorySessions.values()).filter((s) => s.userId === userId);
  list.sort((a, b) => {
    const aTime = getMillis(a.updatedAt || a.createdAt);
    const bTime = getMillis(b.updatedAt || b.createdAt);
    return bTime - aTime;
  });
  return list;
};

/*
========================================
RENAME SESSION
========================================
*/
const renameSession = async (sessionId, title) => {
  try {
    if (sessionCollection) {
      await sessionCollection.doc(sessionId).update({
        title,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.warn("Firestore renameSession fallback to memory:", error.message);
  }

  const sess = inMemorySessions.get(sessionId);
  if (sess) {
    sess.title = title;
    sess.updatedAt = new Date().toISOString();
  }
};

/*
========================================
UPDATE SESSION TITLE
========================================
*/
const updateSessionTitle = async (sessionId, title) => {
  await renameSession(sessionId, title);
};

/*
========================================
DELETE SESSION
========================================
*/
const deleteSession = async (sessionId) => {
  try {
    if (messageCollection && sessionCollection) {
      const snapshot = await messageCollection
        .where("sessionId", "==", sessionId)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      batch.delete(sessionCollection.doc(sessionId));
      await batch.commit();
    }
  } catch (error) {
    console.warn("Firestore deleteSession fallback to memory:", error.message);
  }

  inMemorySessions.delete(sessionId);
  for (const [msgId, msg] of inMemoryMessages.entries()) {
    if (msg.sessionId === sessionId) {
      inMemoryMessages.delete(msgId);
    }
  }
};

/*
========================================
CLEAR ALL HISTORY
========================================
*/
const clearHistory = async (userId) => {
  const sessions = await getSessions(userId);
  for (const session of sessions) {
    await deleteSession(session.id);
  }
};

/*
========================================
SEARCH CHAT
========================================
*/
const searchChats = async (userId, keyword) => {
  const sessions = await getSessions(userId);
  return sessions.filter((session) =>
    (session.title || "").toLowerCase().includes((keyword || "").toLowerCase()),
  );
};

module.exports = {
  createSession,
  getSession,
  saveMessage,
  getMessages,
  getSessions,
  renameSession,
  deleteSession,
  clearHistory,
  updateSessionTitle,
  searchChats,
};
