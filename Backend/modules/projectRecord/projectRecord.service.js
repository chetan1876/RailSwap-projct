const repository = require("./projectRecord.repository");

/**
 * Filter project records based on role and status scoping rules.
 */
const getScopedProjectRecords = async ({ role, status, userContext }) => {
  const allRecords = await repository.getProjectRecords();

  const activeRole = (role || userContext?.role || "user").toLowerCase();
  const activeStatus = (status || "ALL").toLowerCase();

  // Scope records based on activeRole
  let scoped = allRecords.filter((rec) => {
    const recRole = (rec.role || rec.assignedRole || "").toLowerCase();
    const recAllowed = (rec.allowedRoles || []).map((r) => r.toLowerCase());

    // Role matches if:
    // 1. Direct match on role / assignedRole
    // 2. Allowed roles contains the role
    // 3. Specific role field matches
    if (recRole === activeRole) return true;
    if (recAllowed.includes(activeRole)) return true;

    // Role specific field checks
    if (activeRole === "user" && (recRole === "user" || rec.visibility === "public")) return true;
    if (activeRole === "admin") return true; // Admins can view/audit all administrative records
    if (activeRole === "authority" && (rec.authority || recRole === "authority")) return true;
    if (activeRole === "hospital" && (rec.hospital || recRole === "hospital")) return true;
    if (activeRole === "investigator" && (rec.investigator || recRole === "investigator")) return true;
    if (activeRole === "reviewer" && (rec.reviewer || recRole === "reviewer")) return true;

    return false;
  });

  // Apply Status filter if specified and not 'all'
  if (activeStatus && activeStatus !== "all") {
    scoped = scoped.filter(
      (rec) => (rec.status || "").toLowerCase() === activeStatus
    );
  }

  return {
    success: true,
    role: activeRole,
    statusFilter: activeStatus,
    visibleCount: scoped.length,
    totalRecords: allRecords.length,
    data: scoped,
  };
};

const getProjectRecordById = async (id) => {
  const record = await repository.getProjectRecordById(id);
  if (!record) {
    throw new Error("Project record not found");
  }
  return { success: true, data: record };
};

const createProjectRecord = async (recordData) => {
  if (!recordData.title || !recordData.role) {
    throw new Error("Title and role are required fields for a project record.");
  }
  const created = await repository.createProjectRecord(recordData);
  return { success: true, data: created };
};

const seedRecords = async () => {
  await repository.seedProjectRecords();
  return { success: true, message: "Records seeded successfully" };
};

module.exports = {
  getScopedProjectRecords,
  getProjectRecordById,
  createProjectRecord,
  seedRecords,
};
