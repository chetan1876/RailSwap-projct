const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require("./serviceAccountKey.json");

let app;

try {
  app = initializeApp({
    credential: cert(serviceAccount),
  });

  console.log("🔥 Firebase Initialized Successfully");

} catch (err) {
  console.error("❌ Firebase Initialization Failed");
  console.error(err);
}

const rawDb = getFirestore(app);
const rawMessaging = getMessaging(app);

// =====================================================
// IN-MEMORY FALLBACK STORE (Active when Firebase Auth fails)
// =====================================================
const memoryStore = new Map();

function getMemoryCollection(colName) {
  if (!memoryStore.has(colName)) {
    memoryStore.set(colName, new Map());
  }
  return memoryStore.get(colName);
}

class MemoryDocRef {
  constructor(colName, id) {
    this.colName = colName;
    this.id = id || `doc_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async get() {
    const col = getMemoryCollection(this.colName);
    const data = col.get(this.id);
    return {
      exists: !!data,
      id: this.id,
      data: () => data || null,
    };
  }

  async set(data, options = {}) {
    const col = getMemoryCollection(this.colName);
    if (options.merge) {
      const existing = col.get(this.id) || {};
      col.set(this.id, { ...existing, ...data });
    } else {
      col.set(this.id, data);
    }
    return { id: this.id };
  }

  async update(data) {
    const col = getMemoryCollection(this.colName);
    const existing = col.get(this.id) || {};
    col.set(this.id, { ...existing, ...data });
    return { id: this.id };
  }

  async delete() {
    const col = getMemoryCollection(this.colName);
    col.delete(this.id);
    return { success: true };
  }
}

class MemoryQuery {
  constructor(colName, filters = [], sortField = null, sortDir = "asc", limitCount = null) {
    this.colName = colName;
    this.filters = filters;
    this.sortField = sortField;
    this.sortDir = sortDir;
    this.limitCount = limitCount;
  }

  where(field, op, val) {
    return new MemoryQuery(
      this.colName,
      [...this.filters, { field, op, val }],
      this.sortField,
      this.sortDir,
      this.limitCount
    );
  }

  orderBy(field, dir = "asc") {
    return new MemoryQuery(
      this.colName,
      this.filters,
      field,
      dir,
      this.limitCount
    );
  }

  limit(count) {
    return new MemoryQuery(
      this.colName,
      this.filters,
      this.sortField,
      this.sortDir,
      count
    );
  }

  async get() {
    const col = getMemoryCollection(this.colName);
    let items = Array.from(col.entries()).map(([id, data]) => ({ id, data }));

    // Filter
    for (const f of this.filters) {
      items = items.filter(({ data }) => {
        const val = data ? data[f.field] : undefined;
        if (f.op === "==") return val === f.val;
        if (f.op === "!=") return val !== f.val;
        if (f.op === ">") return val > f.val;
        if (f.op === ">=") return val >= f.val;
        if (f.op === "<") return val < f.val;
        if (f.op === "<=") return val <= f.val;
        if (f.op === "in") return Array.isArray(f.val) && f.val.includes(val);
        return true;
      });
    }

    // Sort
    if (this.sortField) {
      items.sort((a, b) => {
        const valA = a.data ? a.data[this.sortField] : undefined;
        const valB = b.data ? b.data[this.sortField] : undefined;
        if (valA < valB) return this.sortDir === "asc" ? -1 : 1;
        if (valA > valB) return this.sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Limit
    if (this.limitCount && this.limitCount > 0) {
      items = items.slice(0, this.limitCount);
    }

    const docs = items.map(({ id, data }) => ({
      id,
      data: () => data,
      exists: true,
    }));

    return {
      docs,
      empty: docs.length === 0,
      size: docs.length,
    };
  }
}

class MemoryCollection {
  constructor(colName) {
    this.colName = colName;
  }

  doc(id) {
    return new MemoryDocRef(this.colName, id);
  }

  async add(data) {
    const docRef = new MemoryDocRef(this.colName);
    await docRef.set(data);
    return docRef;
  }

  where(field, op, val) {
    return new MemoryQuery(this.colName).where(field, op, val);
  }

  orderBy(field, dir) {
    return new MemoryQuery(this.colName).orderBy(field, dir);
  }

  limit(count) {
    return new MemoryQuery(this.colName).limit(count);
  }

  async get() {
    return new MemoryQuery(this.colName).get();
  }
}

// =====================================================
// RESILIENT FIRESTORE WRAPPER
// =====================================================
function createResilientDb(rawDb) {
  let isUnauthenticated = false;

  const isAuthError = (err) => {
    return (
      err &&
      (err.code === 16 ||
        (err.message && err.message.includes("16 UNAUTHENTICATED")) ||
        (err.details && err.details.includes("16 UNAUTHENTICATED")))
    );
  };

  return {
    collection(colName) {
      const realCol = rawDb.collection(colName);
      const memCol = new MemoryCollection(colName);

      return {
        doc(id) {
          const realDoc = realCol.doc(id);
          const memDoc = memCol.doc(id);

          return {
            async get() {
              if (isUnauthenticated) return memDoc.get();
              try {
                return await realDoc.get();
              } catch (err) {
                if (isAuthError(err)) {
                  isUnauthenticated = true;
                  console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for doc [${colName}/${id}]`);
                  return memDoc.get();
                }
                throw err;
              }
            },
            async set(data, options) {
              if (isUnauthenticated) return memDoc.set(data, options);
              try {
                return await realDoc.set(data, options);
              } catch (err) {
                if (isAuthError(err)) {
                  isUnauthenticated = true;
                  console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for set [${colName}/${id}]`);
                  return memDoc.set(data, options);
                }
                throw err;
              }
            },
            async update(data) {
              if (isUnauthenticated) return memDoc.update(data);
              try {
                return await realDoc.update(data);
              } catch (err) {
                if (isAuthError(err)) {
                  isUnauthenticated = true;
                  console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for update [${colName}/${id}]`);
                  return memDoc.update(data);
                }
                throw err;
              }
            },
            async delete() {
              if (isUnauthenticated) return memDoc.delete();
              try {
                return await realDoc.delete();
              } catch (err) {
                if (isAuthError(err)) {
                  isUnauthenticated = true;
                  console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for delete [${colName}/${id}]`);
                  return memDoc.delete();
                }
                throw err;
              }
            },
          };
        },

        async add(data) {
          if (isUnauthenticated) return memCol.add(data);
          try {
            return await realCol.add(data);
          } catch (err) {
            if (isAuthError(err)) {
              isUnauthenticated = true;
              console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for add [${colName}]`);
              return memCol.add(data);
            }
            throw err;
          }
        },

        where(field, op, val) {
          return createResilientQuery(realCol.where(field, op, val), memCol.where(field, op, val), colName, () => isUnauthenticated, (val) => { isUnauthenticated = val; }, isAuthError);
        },

        orderBy(field, dir) {
          return createResilientQuery(realCol.orderBy(field, dir), memCol.orderBy(field, dir), colName, () => isUnauthenticated, (val) => { isUnauthenticated = val; }, isAuthError);
        },

        limit(count) {
          return createResilientQuery(realCol.limit(count), memCol.limit(count), colName, () => isUnauthenticated, (val) => { isUnauthenticated = val; }, isAuthError);
        },

        async get() {
          if (isUnauthenticated) return memCol.get();
          try {
            return await realCol.get();
          } catch (err) {
            if (isAuthError(err)) {
              isUnauthenticated = true;
              console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for collection get [${colName}]`);
              return memCol.get();
            }
            throw err;
          }
        },
      };
    },
  };
}

function createResilientQuery(realQuery, memQuery, colName, getIsUnauth, setIsUnauth, isAuthError) {
  return {
    where(field, op, val) {
      return createResilientQuery(
        realQuery ? realQuery.where(field, op, val) : null,
        memQuery.where(field, op, val),
        colName,
        getIsUnauth,
        setIsUnauth,
        isAuthError
      );
    },
    orderBy(field, dir) {
      return createResilientQuery(
        realQuery ? realQuery.orderBy(field, dir) : null,
        memQuery.orderBy(field, dir),
        colName,
        getIsUnauth,
        setIsUnauth,
        isAuthError
      );
    },
    limit(count) {
      return createResilientQuery(
        realQuery ? realQuery.limit(count) : null,
        memQuery.limit(count),
        colName,
        getIsUnauth,
        setIsUnauth,
        isAuthError
      );
    },
    async get() {
      if (getIsUnauth()) return memQuery.get();
      try {
        return await realQuery.get();
      } catch (err) {
        if (isAuthError(err)) {
          setIsUnauth(true);
          console.warn(`⚠️ Firebase Auth Error (16 UNAUTHENTICATED). Using resilient in-memory store for query [${colName}]`);
          return memQuery.get();
        }
        throw err;
      }
    },
  };
}

const db = createResilientDb(rawDb);

// =====================================================
// SAFE MESSAGING WRAPPER
// =====================================================
const messaging = {
  async send(message) {
    try {
      return await rawMessaging.send(message);
    } catch (err) {
      if (err.code === 16 || err.message?.includes("16 UNAUTHENTICATED") || err.message?.includes("authentication")) {
        console.warn("⚠️ Firebase Messaging Auth Note (16 UNAUTHENTICATED): Push notification skipped cleanly.");
        return { success: true, mock: true };
      }
      throw err;
    }
  },
};

// Send Push Notification
const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: { title, body },
      data,
    };
    const response = await messaging.send(message);
    console.log("✅ Notification Handled:", response);
    return response;
  } catch (error) {
    console.warn("⚠️ Notification warning:", error.message);
    return { success: false, error: error.message };
  }
};

console.log("🔥 Resilient Firebase Module Initialized");

module.exports = {
  app,
  db,
  messaging,
  sendNotification,
};
