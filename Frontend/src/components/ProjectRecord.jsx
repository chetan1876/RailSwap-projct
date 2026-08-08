import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjectRecords } from "../services/projectRecord.service";

const SUPPORTED_ROLES = [
  { key: "user", label: "User", icon: "fa-user" },
  { key: "admin", label: "Admin", icon: "fa-user-shield" },
  { key: "authority", label: "Authority", icon: "fa-landmark" },
  { key: "hospital", label: "Hospital", icon: "fa-hospital" },
  { key: "investigator", label: "Investigator", icon: "fa-magnifying-glass-chart" },
  { key: "reviewer", label: "Reviewer", icon: "fa-clipboard-check" },
];

const STATUS_FILTERS = [
  { key: "ALL", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "completed", label: "Completed" },
];

const ProjectRecord = () => {
  const { user } = useAuth();
  
  // Role State (Defaults to logged in user role or 'user')
  const [activeRole, setActiveRole] = useState(() => {
    return (user?.role || "user").toLowerCase();
  });

  // Status Filter State
  const [activeStatus, setActiveStatus] = useState("ALL");

  // Records & Loading State
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Search filter query within scoped records
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await getProjectRecords(activeRole, activeStatus);
      const data = response.data;
      if (data && data.success) {
        setRecords(data.data || []);
        setVisibleCount(data.visibleCount || (data.data ? data.data.length : 0));
        setTotalRecords(data.totalRecords || 0);
      } else {
        setRecords([]);
        setVisibleCount(0);
      }
    } catch (err) {
      console.error("Error fetching project records:", err);
      setErrorMsg("Failed to load project records from Firebase Firestore.");
      setRecords([]);
      setVisibleCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeRole, activeStatus]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Client search filter within scoped records
  const filteredRecords = records.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.title?.toLowerCase().includes(q) ||
      rec.category?.toLowerCase().includes(q) ||
      rec.description?.toLowerCase().includes(q) ||
      rec.id?.toLowerCase().includes(q)
    );
  });

  const getStatusBadgeStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
      case "completed":
        return { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
      case "active":
        return { background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe" };
      case "pending":
        return { background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" };
      case "rejected":
        return { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" };
      default:
        return { background: "#f3f4f6", color: "#4b5563", border: "1px solid #e5e7eb" };
    }
  };

  return (
    <div className="dashboard-content" style={{ padding: "20px" }}>
      {/* HEADER SECTION */}
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
              <i className="fa-solid fa-folder-open" style={{ marginRight: "10px", color: "#2563eb" }}></i>
              Role-Aware Project Records
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>
              Filter and view records scoped specifically to role authorizations.
            </p>
          </div>

          {/* VISIBLE RECORD COUNT BADGE */}
          <div
            style={{
              background: "#1e293b",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <i className="fa-solid fa-layer-group" style={{ color: "#38bdf8", fontSize: "18px" }}></i>
            <div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8" }}>
                Visible Records
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1" }}>
                {searchQuery ? filteredRecords.length : visibleCount}
                <span style={{ fontSize: "12px", fontWeight: "normal", color: "#cbd5e1", marginLeft: "4px" }}>
                  / {totalRecords > 0 ? totalRecords : records.length} total
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEMO ROLE SWITCHER CONTROL */}
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)",
          border: "1px solid #bfdbfe",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            Demo Role Switcher
          </span>
          <span style={{ fontSize: "13px", color: "#1e40af" }}>
            Current Active Role Scope: <strong>{activeRole.toUpperCase()}</strong>
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {SUPPORTED_ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setActiveRole(r.key)}
              style={{
                background: activeRole === r.key ? "#2563eb" : "#ffffff",
                color: activeRole === r.key ? "#ffffff" : "#1e293b",
                border: activeRole === r.key ? "1px solid #2563eb" : "1px solid #cbd5e1",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className={`fa-solid ${r.icon}`}></i>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ROLE TABS & STATUS FILTERS BAR */}
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "16px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            Select Role View Tab
          </label>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {SUPPORTED_ROLES.map((roleObj) => {
              const isActive = activeRole === roleObj.key;
              return (
                <button
                  key={roleObj.key}
                  onClick={() => setActiveRole(roleObj.key)}
                  className={`tab-btn ${isActive ? "active" : ""}`}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className={`fa-solid ${roleObj.icon}`}></i>
                  {roleObj.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS FILTER & SEARCH BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
              <i className="fa-solid fa-filter" style={{ marginRight: "6px", color: "#64748b" }}></i>
              Status Filter:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveStatus(s.key)}
                  style={{
                    background: activeStatus === s.key ? "#0f172a" : "#f8fafc",
                    color: activeStatus === s.key ? "#ffffff" : "#475569",
                    border: "1px solid",
                    borderColor: activeStatus === s.key ? "#0f172a" : "#e2e8f0",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div style={{ position: "relative", minWidth: "220px" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "12px" }}></i>
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px 6px 30px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {errorMsg && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", fontSize: "14px", marginBottom: "20px" }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "8px" }}></i>
          {errorMsg}
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "32px", color: "#2563eb", marginBottom: "12px" }}></i>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Loading Firestore project records for role: <strong>{activeRole}</strong>...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        /* EMPTY STATE */
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
          <i className="fa-regular fa-folder-open" style={{ fontSize: "40px", color: "#94a3b8", marginBottom: "12px" }}></i>
          <h3 style={{ margin: "0 0 6px 0", color: "#334155", fontSize: "16px" }}>No Records Found</h3>
          <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
            No project records available for role <strong>"{activeRole}"</strong> with status <strong>"{activeStatus}"</strong>.
          </p>
        </div>
      ) : (
        /* SCOPED RECORD LIST */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {filteredRecords.map((rec) => {
            const statusStyle = getStatusBadgeStyle(rec.status);
            return (
              <div
                key={rec.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  {/* TITLE AND STATUS */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a", lineHeight: "1.3" }}>
                      {rec.title}
                    </h3>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        whiteSpace: "nowrap",
                        ...statusStyle,
                      }}
                    >
                      {rec.status || "active"}
                    </span>
                  </div>

                  {/* ID & CATEGORY */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontFamily: "monospace" }}>
                      ID: {rec.id}
                    </span>
                    {rec.category && (
                      <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                        {rec.category}
                      </span>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 14px 0", lineHeight: "1.4" }}>
                    {rec.description}
                  </p>

                  {/* METADATA GRID */}
                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    <div>
                      <span style={{ color: "#94a3b8", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Assigned Role</span>
                      <strong style={{ color: "#334155" }}>{rec.assignedRole || rec.role}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Created By</span>
                      <span style={{ color: "#334155", overflow: "hidden", textOverflow: "ellipsis", display: "block", whiteSpace: "nowrap" }}>
                        {rec.createdBy || "System"}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Assigned To</span>
                      <span style={{ color: "#334155", overflow: "hidden", textOverflow: "ellipsis", display: "block", whiteSpace: "nowrap" }}>
                        {rec.assignedTo || "Unassigned"}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Visibility</span>
                      <span style={{ color: "#334155" }}>{rec.visibility || "restricted"}</span>
                    </div>
                  </div>
                </div>

                {/* FOOTER TIMESTAMPS & ALLOWED ROLES */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "10px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
                  <div>
                    <i className="fa-regular fa-clock" style={{ marginRight: "4px" }}></i>
                    {rec.updatedAt ? new Date(rec.updatedAt).toLocaleDateString() : "Recent"}
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {(rec.allowedRoles || [rec.role]).map((ar, idx) => (
                      <span key={idx} style={{ background: "#e2e8f0", color: "#475569", padding: "1px 6px", borderRadius: "3px", fontSize: "10px" }}>
                        {ar}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectRecord;
