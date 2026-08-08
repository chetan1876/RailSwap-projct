const { db } = require("../../config/firebase");

const COLLECTION = "projectRecords";

const SAMPLE_RECORDS = [
  {
    id: "rec_001",
    title: "Passenger Seat Exchange Audit",
    category: "Seat Management",
    role: "user",
    assignedRole: "user",
    allowedRoles: ["user", "admin"],
    status: "active",
    createdBy: "passenger_01@railswap.org",
    assignedTo: "User Assistance Team",
    owner: "passenger_01@railswap.org",
    visibility: "public",
    reviewer: "admin_super",
    investigator: "investigator_01",
    authority: "railway_board",
    hospital: "central_railway_hosp",
    description: "Standard passenger seat exchange log for train #12951 Express.",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-05T14:30:00.000Z",
  },
  {
    id: "rec_002",
    title: "Emergency Medical Match Clearance",
    category: "Medical Assistance",
    role: "hospital",
    assignedRole: "hospital",
    allowedRoles: ["hospital", "authority", "admin"],
    status: "pending",
    createdBy: "dr_sharma@railwayhosp.org",
    assignedTo: "Central Railway Hospital",
    owner: "dr_sharma@railwayhosp.org",
    visibility: "restricted",
    reviewer: "authority_head",
    investigator: "investigator_02",
    authority: "health_authority",
    hospital: "central_railway_hosp",
    description: "Urgent medical match approval for senior citizen on Coach B2.",
    createdAt: "2026-08-02T11:15:00.000Z",
    updatedAt: "2026-08-06T09:10:00.000Z",
  },
  {
    id: "rec_003",
    title: "Station Security Incident Review",
    category: "Security & Safety",
    role: "investigator",
    assignedRole: "investigator",
    allowedRoles: ["investigator", "authority", "admin"],
    status: "approved",
    createdBy: "rpf_investigator@railway.gov.in",
    assignedTo: "RPF Security Division",
    owner: "rpf_investigator@railway.gov.in",
    visibility: "restricted",
    reviewer: "chief_reviewer",
    investigator: "rpf_investigator",
    authority: "rpf_headquarters",
    hospital: "emergency_care_unit",
    description: "Investigative report on lost luggage item #AI-8839.",
    createdAt: "2026-08-03T08:45:00.000Z",
    updatedAt: "2026-08-07T16:20:00.000Z",
  },
  {
    id: "rec_004",
    title: "Regional Operations Authorization",
    category: "Railway Operations",
    role: "authority",
    assignedRole: "authority",
    allowedRoles: ["authority", "admin"],
    status: "approved",
    createdBy: "divisional_manager@railways.gov.in",
    assignedTo: "Divisional Railway Authority",
    owner: "divisional_manager@railways.gov.in",
    visibility: "internal",
    reviewer: "senior_reviewer",
    investigator: "safety_officer",
    authority: "divisional_railway_office",
    hospital: "railway_divisional_hospital",
    description: "Authority approval for peak season coach reallocation.",
    createdAt: "2026-08-04T12:00:00.000Z",
    updatedAt: "2026-08-07T18:00:00.000Z",
  },
  {
    id: "rec_005",
    title: "System-Wide Compliance Audit",
    category: "System Administration",
    role: "admin",
    assignedRole: "admin",
    allowedRoles: ["admin", "reviewer"],
    status: "active",
    createdBy: "admin_root@railswap.org",
    assignedTo: "System Administration Board",
    owner: "admin_root@railswap.org",
    visibility: "private",
    reviewer: "lead_reviewer",
    investigator: "audit_investigator",
    authority: "railway_board",
    hospital: "n/a",
    description: "Comprehensive system logs and user authentication access audit.",
    createdAt: "2026-08-05T09:30:00.000Z",
    updatedAt: "2026-08-08T10:00:00.000Z",
  },
  {
    id: "rec_006",
    title: "Platform Medical First-Aid Protocol Verification",
    category: "Healthcare",
    role: "reviewer",
    assignedRole: "reviewer",
    allowedRoles: ["reviewer", "hospital", "admin"],
    status: "completed",
    createdBy: "review_board@railswap.org",
    assignedTo: "Medical Safety Review Board",
    owner: "review_board@railswap.org",
    visibility: "internal",
    reviewer: "review_board",
    investigator: "medical_investigator",
    authority: "health_ministry",
    hospital: "metro_general_hospital",
    description: "Quarterly review of platform medical response logs.",
    createdAt: "2026-08-06T14:20:00.000Z",
    updatedAt: "2026-08-08T08:15:00.000Z",
  },
  {
    id: "rec_007",
    title: "Passenger Dispute Resolution Record",
    category: "User Support",
    role: "user",
    assignedRole: "user",
    allowedRoles: ["user", "reviewer"],
    status: "completed",
    createdBy: "passenger_02@railswap.org",
    assignedTo: "Passenger Service Desk",
    owner: "passenger_02@railswap.org",
    visibility: "public",
    reviewer: "user_grievance_officer",
    investigator: "support_team",
    authority: "passenger_welfare",
    hospital: "n/a",
    description: "Resolved seat exchange refund inquiry.",
    createdAt: "2026-08-06T17:10:00.000Z",
    updatedAt: "2026-08-07T11:40:00.000Z",
  },
  {
    id: "rec_008",
    title: "Hospital Trauma Response Readiness",
    category: "Emergency Care",
    role: "hospital",
    assignedRole: "hospital",
    allowedRoles: ["hospital", "authority"],
    status: "active",
    createdBy: "trauma_unit@railwayhosp.org",
    assignedTo: "Emergency Care Unit",
    owner: "trauma_unit@railwayhosp.org",
    visibility: "restricted",
    reviewer: "medical_director",
    investigator: "health_inspector",
    authority: "disaster_management",
    hospital: "railway_central_hospital",
    description: "Standby record for onboard medical emergency triage.",
    createdAt: "2026-08-07T07:50:00.000Z",
    updatedAt: "2026-08-08T09:00:00.000Z",
  },
  {
    id: "rec_009",
    title: "Safety Inspector Field Verification",
    category: "Security & Safety",
    role: "investigator",
    assignedRole: "investigator",
    allowedRoles: ["investigator", "admin"],
    status: "rejected",
    createdBy: "field_investigator@railway.gov.in",
    assignedTo: "Field Investigation Unit",
    owner: "field_investigator@railway.gov.in",
    visibility: "restricted",
    reviewer: "chief_inspector",
    investigator: "field_investigator",
    authority: "rpf_headquarters",
    hospital: "n/a",
    description: "Field claim verification rejected due to insufficient evidence.",
    createdAt: "2026-08-07T13:15:00.000Z",
    updatedAt: "2026-08-08T10:10:00.000Z",
  },
  {
    id: "rec_010",
    title: "Division Infrastructure Maintenance Signoff",
    category: "Railway Operations",
    role: "authority",
    assignedRole: "authority",
    allowedRoles: ["authority", "admin", "reviewer"],
    status: "pending",
    createdBy: "chief_engineer@railways.gov.in",
    assignedTo: "Engineering Division",
    owner: "chief_engineer@railways.gov.in",
    visibility: "internal",
    reviewer: "quality_reviewer",
    investigator: "structural_auditor",
    authority: "railway_engineering_authority",
    hospital: "n/a",
    description: "Pending sign-off for track safety validation.",
    createdAt: "2026-08-07T15:40:00.000Z",
    updatedAt: "2026-08-08T10:30:00.000Z",
  },
  {
    id: "rec_011",
    title: "Quality Assurance Final Review",
    category: "Quality Assurance",
    role: "reviewer",
    assignedRole: "reviewer",
    allowedRoles: ["reviewer", "admin"],
    status: "approved",
    createdBy: "qa_lead@railswap.org",
    assignedTo: "QA Review Team",
    owner: "qa_lead@railswap.org",
    visibility: "internal",
    reviewer: "qa_lead",
    investigator: "code_auditor",
    authority: "tech_governance",
    hospital: "n/a",
    description: "Final code quality and security verification review.",
    createdAt: "2026-08-07T18:20:00.000Z",
    updatedAt: "2026-08-08T07:45:00.000Z",
  },
  {
    id: "rec_012",
    title: "Global Platform Policy Audit",
    category: "System Administration",
    role: "admin",
    assignedRole: "admin",
    allowedRoles: ["admin", "authority", "reviewer"],
    status: "pending",
    createdBy: "security_admin@railswap.org",
    assignedTo: "Executive Admin Committee",
    owner: "security_admin@railswap.org",
    visibility: "private",
    reviewer: "compliance_officer",
    investigator: "forensic_auditor",
    authority: "board_of_directors",
    hospital: "n/a",
    description: "Pending admin review for platform terms update.",
    createdAt: "2026-08-08T06:10:00.000Z",
    updatedAt: "2026-08-08T10:00:00.000Z",
  },
];

const seedProjectRecords = async () => {
  try {
    const snapshot = await db.collection(COLLECTION).get();
    if (snapshot.empty || snapshot.docs.length === 0) {
      console.log("🌱 Seeding Firestore projectRecords collection...");
      for (const record of SAMPLE_RECORDS) {
        await db.collection(COLLECTION).doc(record.id).set(record);
      }
      console.log("✅ Firestore projectRecords seeded successfully.");
    }
  } catch (err) {
    console.warn("⚠️ Firestore Seed Warning:", err.message);
  }
};

const getProjectRecords = async () => {
  try {
    // Ensure seeded data is present
    await seedProjectRecords();

    const snapshot = await db.collection(COLLECTION).get();
    const records = [];
    snapshot.docs.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });

    if (records.length === 0) {
      return SAMPLE_RECORDS;
    }

    return records;
  } catch (error) {
    console.warn("⚠️ Firestore getProjectRecords fallback to sample data:", error.message);
    return SAMPLE_RECORDS;
  }
};

const getProjectRecordById = async (id) => {
  try {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return SAMPLE_RECORDS.find((r) => r.id === id) || null;
  } catch (error) {
    return SAMPLE_RECORDS.find((r) => r.id === id) || null;
  }
};

const createProjectRecord = async (recordData) => {
  try {
    const newDocRef = await db.collection(COLLECTION).add({
      ...recordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const doc = await newDocRef.get();
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    const newId = `rec_${Date.now()}`;
    const record = {
      id: newId,
      ...recordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    SAMPLE_RECORDS.push(record);
    return record;
  }
};

module.exports = {
  seedProjectRecords,
  getProjectRecords,
  getProjectRecordById,
  createProjectRecord,
  SAMPLE_RECORDS,
};
