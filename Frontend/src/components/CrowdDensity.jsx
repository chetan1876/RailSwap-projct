import { useState, useEffect, useCallback, useRef } from "react";
import "../styles/crowdDensity.css";
import {
  searchCrowd,
  getCrowdDashboard,
} from "../services/crowdDensity.service";

/* =========================================================
   UTILITY HELPERS
   ========================================================= */
const getOccupancyColor = (occ) => {
  if (occ >= 100) return "#7f1d1d";
  if (occ >= 85) return "#ef4444";
  if (occ >= 65) return "#f97316";
  if (occ >= 40) return "#eab308";
  return "#22c55e";
};

const getOccupancyBg = (occ) => {
  if (occ >= 100) return "var(--cd-dark-red)";
  if (occ >= 85) return "var(--cd-red)";
  if (occ >= 65) return "var(--cd-orange)";
  if (occ >= 40) return "var(--cd-yellow)";
  return "var(--cd-green)";
};

const getAlertTypeClass = (type) => {
  const map = {
    critical: "cd-alert--critical",
    warning: "cd-alert--warning",
    festive: "cd-alert--festive",
    peak: "cd-alert--peak",
    good: "cd-alert--good",
    info: "cd-alert--info",
  };
  return map[type] || "cd-alert--info";
};

const getPriorityClass = (priority) => {
  const map = {
    high: "cd-rec--high",
    medium: "cd-rec--medium",
    low: "cd-rec--low",
  };
  return map[priority] || "cd-rec--low";
};

/* =========================================================
   SUBCOMPONENTS
   ========================================================= */

/* --- Skeleton Loader --- */
const Skeleton = ({ className = "" }) => (
  <div className={`cd-skeleton ${className}`} />
);

/* --- Circular Progress Ring --- */
const CircularProgress = ({
  value,
  size = 120,
  stroke = 10,
  color,
  label,
  sublabel,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="cd-circular" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || "#6366f1"}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="cd-circular__ring"
        />
      </svg>
      <div className="cd-circular__label">
        <span className="cd-circular__value">{Math.round(value)}%</span>
        {sublabel && <span className="cd-circular__sub">{sublabel}</span>}
      </div>
    </div>
  );
};

/* --- Occupancy Bar --- */
const OccupancyBar = ({ value, animated = true }) => {
  const color = getOccupancyBg(value);
  return (
    <div className="cd-bar-track">
      <div
        className={`cd-bar-fill ${animated ? "cd-bar-fill--animated" : ""}`}
        style={{ width: `${Math.min(value, 100)}%`, background: color }}
      />
    </div>
  );
};

/* --- Stat Card --- */
const StatCard = ({ icon, title, value, sub, accent, loading }) => (
  <div className={`cd-stat-card ${accent ? `cd-stat-card--${accent}` : ""}`}>
    {loading ? (
      <>
        <Skeleton className="cd-skeleton--icon" />
        <Skeleton className="cd-skeleton--value" />
        <Skeleton className="cd-skeleton--label" />
      </>
    ) : (
      <>
        <div className="cd-stat-icon">{icon}</div>
        <div className="cd-stat-value">{value}</div>
        <div className="cd-stat-title">{title}</div>
        {sub && <div className="cd-stat-sub">{sub}</div>}
      </>
    )}
  </div>
);

/* --- Coach Card --- */
const CoachCard = ({ coach, selected, onClick }) => {
  const color = getOccupancyColor(coach.occupancy);
  const bg = getOccupancyBg(coach.occupancy);

  return (
    <button
      className={`cd-coach-card ${selected ? "cd-coach-card--selected" : ""}`}
      onClick={() => onClick(coach)}
      style={{ "--coach-color": bg }}
      id={`coach-card-${coach.coach}`}
    >
      <div className="cd-coach-badge" style={{ background: bg }}>
        {coach.coach}
      </div>
      <div className="cd-coach-type">{coach.type}</div>
      <div className="cd-coach-occ" style={{ color }}>
        {coach.occupancy}%
      </div>
      <OccupancyBar value={coach.occupancy} animated />
      <div className="cd-coach-seats">
        <span className="cd-coach-avail">{coach.available} free</span>
      </div>
      <div className="cd-coach-comfort">
        <span
          className={`cd-tag cd-tag--${coach.riskLevel?.toLowerCase() || "low"}`}
        >
          {coach.riskLevel}
        </span>
      </div>
    </button>
  );
};

/* --- Coach Detail Panel --- */
const CoachDetailPanel = ({ coach, onClose }) => {
  if (!coach) return null;
  const color = getOccupancyColor(coach.occupancy);
  const bg = getOccupancyBg(coach.occupancy);

  return (
    <div className="cd-detail-overlay" onClick={onClose}>
      <div className="cd-detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="cd-detail-close" onClick={onClose}>
          ✕
        </button>
        <div className="cd-detail-header" style={{ background: bg }}>
          <span className="cd-detail-coach-name">{coach.coach}</span>
          <span className="cd-detail-coach-type">{coach.type} Coach</span>
        </div>
        <div className="cd-detail-body">
          <div className="cd-detail-stat-row">
            <div className="cd-detail-stat">
              <span className="cd-detail-stat-label">Occupancy</span>
              <span className="cd-detail-stat-val" style={{ color }}>
                {coach.occupancy}%
              </span>
            </div>
            <div className="cd-detail-stat">
              <span className="cd-detail-stat-label">Total Seats</span>
              <span className="cd-detail-stat-val">{coach.seats}</span>
            </div>
            <div className="cd-detail-stat">
              <span className="cd-detail-stat-label">Occupied</span>
              <span className="cd-detail-stat-val">{coach.occupied}</span>
            </div>
            <div className="cd-detail-stat">
              <span className="cd-detail-stat-label">Available</span>
              <span className="cd-detail-stat-val" style={{ color: "#22c55e" }}>
                {coach.available}
              </span>
            </div>
          </div>
          <div className="cd-detail-progress">
            <OccupancyBar value={coach.occupancy} animated />
          </div>
          <div className="cd-detail-tags">
            <span
              className={`cd-tag cd-tag--${coach.riskLevel?.toLowerCase() || "low"}`}
            >
              {coach.riskLevel} Risk
            </span>
            <span className="cd-tag cd-tag--neutral">{coach.crowdLevel}</span>
            <span className="cd-tag cd-tag--comfort">
              Comfort: {coach.comfortScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Timeline Entry --- */
const TimelineEntry = ({ entry, isFirst }) => {
  const color = getOccupancyBg(entry.occupancy);
  const trendIcon =
    entry.trend === "increasing"
      ? "↑"
      : entry.trend === "decreasing"
        ? "↓"
        : "→";
  const trendClass =
    entry.trend === "increasing"
      ? "cd-tl-trend--up"
      : entry.trend === "decreasing"
        ? "cd-tl-trend--down"
        : "cd-tl-trend--stable";

  return (
    <div className={`cd-tl-entry ${isFirst ? "cd-tl-entry--first" : ""}`}>
      <div className="cd-tl-dot" style={{ background: color }} />
      <div className="cd-tl-content">
        <div className="cd-tl-label">{entry.label}</div>
        <div className="cd-tl-bar-wrap">
          <OccupancyBar value={entry.occupancy} />
        </div>
        <div className="cd-tl-meta">
          <span className="cd-tl-occ" style={{ color }}>
            {entry.occupancy}%
          </span>
          <span className={`cd-tl-trend ${trendClass}`}>
            {trendIcon} {entry.crowdLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

/* --- Heatmap Train View --- */
const HeatmapView = ({ heatmap }) => {
  if (!heatmap || heatmap.length === 0) return null;

  return (
    <div className="cd-heatmap">
      <div className="cd-heatmap-legend">
        <span style={{ color: "#22c55e" }}>● Low (&lt;40%)</span>
        <span style={{ color: "#eab308" }}>● Moderate (40-65%)</span>
        <span style={{ color: "#f97316" }}>● High (65-85%)</span>
        <span style={{ color: "#ef4444" }}>● Very High (85-99%)</span>
        <span style={{ color: "#7f1d1d" }}>● Overcrowded (100%+)</span>
      </div>
      <div className="cd-heatmap-train">
        {heatmap.map((item, idx) => (
          <div
            key={idx}
            className="cd-heatmap-coach"
            style={{
              background: item.color,
              opacity: 0.5 + item.intensity * 0.5,
            }}
            title={`${item.coach} (${item.type}): ${item.occupancy}%`}
          >
            <span className="cd-heatmap-label">{item.coach}</span>
            <span className="cd-heatmap-pct">{item.occupancy}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- Empty State --- */
const EmptyState = () => (
  <div className="cd-empty">
    <div className="cd-empty-icon">🚂</div>
    <h3 className="cd-empty-title">Search to Get Started</h3>
    <p className="cd-empty-sub">
      Enter a train number, name, PNR, coach code, or station.
      <br />
      Our AI will automatically detect what you're looking for.
    </p>
    <div className="cd-empty-examples">
      <span className="cd-example-chip" onClick={() => {}}>
        12301 — Howrah Rajdhani
      </span>
      <span className="cd-example-chip">S5 — Coach search</span>
      <span className="cd-example-chip">New Delhi — Station</span>
      <span className="cd-example-chip">1234567890 — PNR</span>
    </div>
  </div>
);

/* --- Error State --- */
const ErrorState = ({ message, onRetry }) => (
  <div className="cd-error">
    <div className="cd-error-icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p>{message || "Unable to fetch crowd data. Please try again."}</p>
    <button className="cd-btn cd-btn--primary" onClick={onRetry}>
      Retry
    </button>
  </div>
);

/* --- Bar Chart Component --- */
const BarChart = ({ coaches }) => {
  if (!coaches || coaches.length === 0) return null;
  const chartCoaches = coaches.filter((c) => c.coach !== "ENG").slice(0, 12);
  const maxOcc = 120;

  return (
    <div className="cd-chart-bar">
      {chartCoaches.map((c, idx) => {
        const height = Math.max(4, (c.occupancy / maxOcc) * 100);
        const color = getOccupancyBg(c.occupancy);
        return (
          <div key={idx} className="cd-chart-bar-col">
            <div
              className="cd-chart-bar-label-top"
              style={{ color: getOccupancyColor(c.occupancy) }}
            >
              {c.occupancy}%
            </div>
            <div className="cd-chart-bar-fill-wrap">
              <div
                className="cd-chart-bar-fill"
                style={{ height: `${height}%`, background: color }}
              />
            </div>
            <div className="cd-chart-bar-label">{c.coach}</div>
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
const CrowdDensity = () => {
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashLoading, setDashLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  // Load dashboard on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setDashLoading(true);
      const result = await getCrowdDashboard();
      if (result.success) setDashData(result.data);
    } catch {
      // Silent fail for dashboard
    } finally {
      setDashLoading(false);
    }
  };

  // Debounced search
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Don't auto-search, let user press enter or click
  };

  const handleSearch = useCallback(
    async (searchQuery) => {
      const q = (searchQuery || searchInput).trim();
      if (!q) return;

      setQuery(q);
      setLoading(true);
      setError(null);
      setData(null);
      setActiveTab("overview");

      try {
        const filters = {};
        if (filterDate) filters.date = filterDate;
        if (filterTime) filters.time = filterTime;
        if (filterClass) filters.classType = filterClass;

        const result = await searchCrowd(q, filters);
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Prediction failed");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to connect to server",
        );
      } finally {
        setLoading(false);
      }
    },
    [searchInput, filterDate, filterTime, filterClass],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleExampleClick = (example) => {
    setSearchInput(example);
    handleSearch(example);
  };

  const renderSearchTypeChip = (type) => {
    const labels = {
      TRAIN_NUMBER: "🔢 Train Number",
      TRAIN_NAME: "🚂 Train Name",
      PNR: "📋 PNR",
      COACH: "🚃 Coach",
      STATION: "🚉 Station",
      SOURCE: "📍 Source",
      DESTINATION: "📍 Destination",
      UNKNOWN: "🔍 Search",
    };
    return <span className="cd-search-type-chip">{labels[type] || type}</span>;
  };

  const dashboard = data?.dashboard;
  const coaches = data?.coaches || [];
  const heatmap = data?.heatmap || [];
  const timeline = data?.timeline || [];
  const alerts = data?.alerts || [];
  const recommendations = data?.recommendations || [];
  const trainInfo = data?.trainInfo;
  const stationCrowd = data?.stationCrowd || [];

  return (
    <div
      className={`cd-root ${darkMode ? "cd-root--dark" : ""}`}
      id="crowd-density-module"
    >
      {/* ===== HEADER ===== */}
      <div className="cd-header">
        <div className="cd-header-left">
          <div className="cd-header-icon">🎯</div>
          <div>
            <h1 className="cd-title">AI Crowd Intelligence</h1>
            <p className="cd-subtitle">
              Real-time crowd prediction & passenger flow analytics
            </p>
          </div>
        </div>
        <div className="cd-header-right">
          <div className="cd-live-pill">
            <span className="cd-live-dot" />
            Live Monitoring
          </div>
          <button
            className="cd-icon-btn"
            onClick={() => setDarkMode((d) => !d)}
            title="Toggle dark mode"
            id="cd-dark-toggle"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="cd-search-wrap">
        <div className="cd-search-box">
          <span className="cd-search-icon">🔍</span>
          <input
            ref={searchRef}
            id="cd-search-input"
            className="cd-search-input"
            type="text"
            placeholder="Search by train number, name, PNR, coach code, or station..."
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {searchInput && (
            <button
              className="cd-search-clear"
              onClick={() => {
                setSearchInput("");
                setData(null);
                setError(null);
              }}
            >
              ✕
            </button>
          )}
          <button
            className="cd-search-btn"
            onClick={() => handleSearch()}
            disabled={loading}
            id="cd-search-btn"
          >
            {loading ? <span className="cd-spinner" /> : "Predict →"}
          </button>
        </div>

        <div className="cd-search-meta">
          <div className="cd-examples">
            {["12301", "Rajdhani", "S5", "New Delhi", "1234567890"].map(
              (ex) => (
                <button
                  key={ex}
                  className="cd-example-chip"
                  onClick={() => handleExampleClick(ex)}
                >
                  {ex}
                </button>
              ),
            )}
          </div>
          <button
            className={`cd-filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((f) => !f)}
            id="cd-filter-toggle"
          >
            ⚙️ Filters
          </button>
        </div>

        {/* Optional Filters */}
        {showFilters && (
          <div className="cd-filters">
            <div className="cd-filter-group">
              <label>📅 Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="cd-filter-group">
              <label>⏰ Time</label>
              <input
                type="time"
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
              />
            </div>
            <div className="cd-filter-group">
              <label>🚃 Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">All Classes</option>
                <option value="1A">1A — AC First</option>
                <option value="2A">2A — AC 2 Tier</option>
                <option value="3A">3A — AC 3 Tier</option>
                <option value="SL">SL — Sleeper</option>
                <option value="GN">GN — General</option>
                <option value="CC">CC — Chair Car</option>
              </select>
            </div>
            <button
              className="cd-btn cd-btn--ghost cd-filter-clear"
              onClick={() => {
                setFilterDate("");
                setFilterTime("");
                setFilterClass("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ===== DASHBOARD SUMMARY (when no search) ===== */}
      {!data && !loading && !error && (
        <div className="cd-dash-summary">
          <div className="cd-dash-stat-row">
            {dashLoading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="cd-skeleton--stat" />
                ))
            ) : dashData ? (
              <>
                <StatCard
                  icon="👥"
                  title="Avg Occupancy"
                  value={`${dashData.summary.avgOccupancy}%`}
                  sub="Across popular trains"
                  accent="blue"
                />
                <StatCard
                  icon="⚠️"
                  title="Risk Level"
                  value={dashData.summary.riskLevel}
                  sub="Current assessment"
                  accent="orange"
                />
                <StatCard
                  icon="💺"
                  title="Available Seats"
                  value={dashData.summary.totalAvailable.toLocaleString()}
                  sub="Total across trains"
                  accent="green"
                />
                <StatCard
                  icon="🚆"
                  title="Active Trains"
                  value={dashData.summary.activeTrains}
                  sub="Being monitored"
                  accent="purple"
                />
                <StatCard
                  icon="😊"
                  title="Comfort Score"
                  value={`${dashData.summary.comfortScore}%`}
                  sub={dashData.summary.comfortLabel}
                  accent="teal"
                />
                <StatCard
                  icon="🧠"
                  title="AI Confidence"
                  value="95%"
                  sub="Prediction accuracy"
                  accent="pink"
                />
              </>
            ) : null}
          </div>

          {!dashLoading && dashData && (
            <div className="cd-dash-trains">
              <h3 className="cd-section-title">
                🔥 Popular Train Crowd Status
              </h3>
              <div className="cd-dash-train-grid">
                {dashData.trains.map((t, i) => (
                  <button
                    key={i}
                    className="cd-dash-train-card"
                    onClick={() =>
                      handleExampleClick(
                        t.trainInfo.number !== "XXXXX"
                          ? t.trainInfo.number
                          : t.trainInfo.name,
                      )
                    }
                  >
                    <div className="cd-dash-train-name">{t.trainInfo.name}</div>
                    <div className="cd-dash-train-route">
                      {t.trainInfo.source} → {t.trainInfo.destination}
                    </div>
                    <OccupancyBar value={t.dashboard.overallCrowd} />
                    <div className="cd-dash-train-meta">
                      <span
                        style={{
                          color: getOccupancyColor(t.dashboard.overallCrowd),
                        }}
                      >
                        {t.dashboard.overallCrowd}%
                      </span>
                      <span
                        className={`cd-tag cd-tag--${t.dashboard.riskLevel?.toLowerCase() || "low"}`}
                      >
                        {t.dashboard.riskLevel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <EmptyState />
        </div>
      )}

      {/* ===== ERROR STATE ===== */}
      {error && !loading && (
        <ErrorState message={error} onRetry={() => handleSearch()} />
      )}

      {/* ===== LOADING SKELETON ===== */}
      {loading && (
        <div className="cd-loading-wrap">
          <div className="cd-loading-pulse">
            <div className="cd-loading-icon">🤖</div>
            <h3>AI Engine Processing...</h3>
            <p>
              Analyzing crowd data for: <strong>{searchInput}</strong>
            </p>
          </div>
          <div className="cd-stat-grid">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="cd-skeleton--stat" />
              ))}
          </div>
          <Skeleton className="cd-skeleton--heatmap" />
          <Skeleton className="cd-skeleton--chart" />
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {data && !loading && (
        <div className="cd-results" id="cd-results">
          {/* Result Header */}
          <div className="cd-result-header">
            <div className="cd-result-train-info">
              <h2 className="cd-result-train-name">
                {trainInfo?.name || query}
              </h2>
              <div className="cd-result-train-meta">
                {trainInfo?.number && trainInfo.number !== "XXXXX" && (
                  <span className="cd-tag cd-tag--number">
                    #{trainInfo.number}
                  </span>
                )}
                <span className="cd-tag cd-tag--type">{trainInfo?.type}</span>
                {trainInfo?.source && trainInfo.source !== "Origin" && (
                  <span className="cd-tag cd-tag--route">
                    {trainInfo.source} → {trainInfo.destination}
                  </span>
                )}
                {renderSearchTypeChip(data.searchType)}
              </div>
            </div>
            <div className="cd-result-confidence">
              <span className="cd-confidence-label">AI Confidence</span>
              <span className="cd-confidence-value">
                {dashboard?.confidenceScore}%
              </span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="cd-kpi-grid">
            <div className="cd-kpi-card cd-kpi-card--main">
              <CircularProgress
                value={dashboard?.overallCrowd || 0}
                size={140}
                stroke={12}
                color={getOccupancyColor(dashboard?.overallCrowd || 0)}
                sublabel="Overall"
              />
            </div>

            <StatCard
              icon="💺"
              title="Available Seats"
              value={dashboard?.totalAvailable?.toLocaleString()}
              sub={`of ${dashboard?.totalSeats?.toLocaleString()} total`}
              accent="green"
            />
            <StatCard
              icon="📈"
              title="Expected Occupancy"
              value={`${dashboard?.expectedOccupancy}%`}
              sub="Projected peak"
              accent="orange"
            />
            <StatCard
              icon="😊"
              title="Comfort Score"
              value={`${dashboard?.comfortScore}%`}
              sub={dashboard?.comfortLabel}
              accent="teal"
            />
            <StatCard
              icon="🎯"
              title="Prediction Accuracy"
              value={`${dashboard?.confidenceScore}%`}
              sub="AI Confidence"
              accent="purple"
            />
            <StatCard
              icon="⏰"
              title="Peak Time"
              value={dashboard?.predictedPeakTime?.split(" ")[0]}
              sub={dashboard?.predictedPeakTime}
              accent="pink"
            />
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="cd-alerts-section">
              <h3 className="cd-section-title">🚨 Smart Alerts</h3>
              <div className="cd-alerts-grid">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`cd-alert-card ${getAlertTypeClass(alert.type)}`}
                  >
                    <span className="cd-alert-icon">{alert.icon}</span>
                    <div className="cd-alert-content">
                      <div className="cd-alert-title">{alert.title}</div>
                      <div className="cd-alert-msg">{alert.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="cd-tabs" id="cd-tabs">
            {[
              "overview",
              "coaches",
              "heatmap",
              "timeline",
              "stations",
              "recommendations",
            ].map((tab) => (
              <button
                key={tab}
                id={`cd-tab-${tab}`}
                className={`cd-tab ${activeTab === tab ? "cd-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "overview" && "📊 Overview"}
                {tab === "coaches" && "🚃 Coaches"}
                {tab === "heatmap" && "🔥 Heatmap"}
                {tab === "timeline" && "⏳ Timeline"}
                {tab === "stations" && "🚉 Stations"}
                {tab === "recommendations" && "💡 AI Recs"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="cd-tab-content">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="cd-tab-pane" id="cd-tab-content-overview">
                <div className="cd-overview-grid">
                  {/* Bar Chart */}
                  <div className="cd-card">
                    <h3 className="cd-card-title">
                      📊 Coach Occupancy Comparison
                    </h3>
                    <BarChart coaches={coaches} />
                  </div>

                  {/* Station Crowd Quick View */}
                  <div className="cd-card">
                    <h3 className="cd-card-title">🚉 Station Crowd Overview</h3>
                    <div className="cd-station-list">
                      {stationCrowd.map((s, i) => (
                        <div key={i} className="cd-station-item">
                          <div className="cd-station-name">
                            {s.type === "departure"
                              ? "🟢"
                              : s.type === "arrival"
                                ? "🔴"
                                : "🔵"}{" "}
                            {s.station}
                          </div>
                          <OccupancyBar value={s.platformCrowd} />
                          <div className="cd-station-meta">
                            <span
                              style={{
                                color: getOccupancyColor(s.platformCrowd),
                              }}
                            >
                              {s.platformCrowd}%
                            </span>
                            <span className="cd-station-board">
                              ↑{s.boardingPrediction} board
                            </span>
                            <span className="cd-station-alight">
                              ↓{s.alightingPrediction} alight
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COACHES TAB */}
            {activeTab === "coaches" && (
              <div className="cd-tab-pane" id="cd-tab-content-coaches">
                <div className="cd-coaches-toolbar">
                  <p className="cd-coaches-count">
                    {coaches.length} coaches found
                  </p>
                  <div className="cd-coaches-legend">
                    <span style={{ color: "#22c55e" }}>● Low</span>
                    <span style={{ color: "#eab308" }}>● Moderate</span>
                    <span style={{ color: "#f97316" }}>● High</span>
                    <span style={{ color: "#ef4444" }}>● Very High</span>
                    <span style={{ color: "#7f1d1d" }}>● Overcrowded</span>
                  </div>
                </div>
                <div className="cd-coaches-grid">
                  {coaches.map((coach, idx) => (
                    <CoachCard
                      key={idx}
                      coach={coach}
                      selected={selectedCoach?.coach === coach.coach}
                      onClick={setSelectedCoach}
                    />
                  ))}
                </div>
                {selectedCoach && (
                  <CoachDetailPanel
                    coach={selectedCoach}
                    onClose={() => setSelectedCoach(null)}
                  />
                )}
              </div>
            )}

            {/* HEATMAP TAB */}
            {activeTab === "heatmap" && (
              <div className="cd-tab-pane" id="cd-tab-content-heatmap">
                <div className="cd-card">
                  <h3 className="cd-card-title">🔥 Train Crowd Heatmap</h3>
                  <p className="cd-card-sub">
                    Visual representation of crowd density across all coaches
                  </p>
                  <HeatmapView heatmap={heatmap} />
                </div>
                <div className="cd-card cd-card--mt">
                  <h3 className="cd-card-title">
                    📊 Coach Occupancy Distribution
                  </h3>
                  <BarChart coaches={coaches} />
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "timeline" && (
              <div className="cd-tab-pane" id="cd-tab-content-timeline">
                <div className="cd-card">
                  <h3 className="cd-card-title">
                    ⏳ Crowd Prediction Timeline
                  </h3>
                  <p className="cd-card-sub">
                    AI-predicted crowd evolution over time
                  </p>
                  <div className="cd-timeline">
                    {timeline.map((entry, i) => (
                      <TimelineEntry key={i} entry={entry} isFirst={i === 0} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STATIONS TAB */}
            {activeTab === "stations" && (
              <div className="cd-tab-pane" id="cd-tab-content-stations">
                <div className="cd-stations-grid">
                  {stationCrowd.map((s, i) => (
                    <div
                      key={i}
                      className={`cd-station-card cd-station-card--${s.type}`}
                    >
                      <div className="cd-station-card-header">
                        <span className="cd-station-card-type">
                          {s.type === "departure"
                            ? "🟢 Departure"
                            : s.type === "arrival"
                              ? "🔴 Arrival"
                              : "🔵 Intermediate"}
                        </span>
                        <span
                          className={`cd-tag cd-tag--${s.riskLevel?.toLowerCase() || "low"}`}
                        >
                          {s.riskLevel}
                        </span>
                      </div>
                      <h4 className="cd-station-card-name">{s.station}</h4>
                      <div className="cd-station-card-stat">
                        <div>
                          <span className="cd-station-card-label">
                            Platform Crowd
                          </span>
                          <span
                            className="cd-station-card-value"
                            style={{
                              color: getOccupancyColor(s.platformCrowd),
                            }}
                          >
                            {s.platformCrowd}%
                          </span>
                        </div>
                      </div>
                      <OccupancyBar value={s.platformCrowd} />
                      <div className="cd-station-card-flows">
                        <div className="cd-flow cd-flow--board">
                          <span>↑ Boarding</span>
                          <strong>{s.boardingPrediction}</strong>
                        </div>
                        <div className="cd-flow cd-flow--alight">
                          <span>↓ Alighting</span>
                          <strong>{s.alightingPrediction}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECOMMENDATIONS TAB */}
            {activeTab === "recommendations" && (
              <div className="cd-tab-pane" id="cd-tab-content-recommendations">
                <div className="cd-recs-grid">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className={`cd-rec-card ${getPriorityClass(rec.priority)}`}
                    >
                      <div className="cd-rec-icon">{rec.icon}</div>
                      <div className="cd-rec-content">
                        <div className="cd-rec-title">{rec.title}</div>
                        <div className="cd-rec-msg">{rec.message}</div>
                      </div>
                      <div className="cd-rec-priority">
                        <span className="cd-priority-badge">
                          {rec.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Generated At */}
          <div className="cd-footer">
            🤖 AI Prediction generated at{" "}
            {new Date(data.generatedAt).toLocaleTimeString()} • Data is for
            planning purposes
          </div>
        </div>
      )}
    </div>
  );
};

export default CrowdDensity;
