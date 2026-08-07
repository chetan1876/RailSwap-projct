import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationAPI } from "../services/notification.service";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const userId = user?.id || user?._id || user?.uid;

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!userId || !token) return;
    try {
      const [listRes, countRes] = await Promise.all([
        notificationAPI.getAllNotifications(userId, token),
        notificationAPI.getNotificationCount(userId, token),
      ]);
      setNotifications(listRes.data.data || []);
      setUnreadCount(countRes.data.data?.unread || countRes.data.data?.total || 0);
    } catch (err) {
      console.error("Navbar Notification Error:", err);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) {
      fetchNotifications();
    }
  }, [userId, token, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    if (!token) return;
    try {
      await notificationAPI.markAsRead(notificationId, token);
      fetchNotifications();
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId || !token) return;
    try {
      await notificationAPI.markAllAsRead(userId, token);
      fetchNotifications();
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!token) return;
    try {
      await notificationAPI.deleteNotification(notificationId, token);
      fetchNotifications();
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <i className="fa-solid fa-train"></i>
          RailSwap
        </Link>
      </div>

      <div className="navbar-search">
        <i className="fa-solid fa-magnifying-glass"></i>

        <input
          type="text"
          placeholder="Search features..."
        />
      </div>

      <div className="navbar-right">
        <div style={{ position: "relative" }}>
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: "relative" }}
          >
            <i className="fa-regular fa-bell"></i>
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  lineHeight: "1",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="dropdown-menu"
              style={{
                width: "320px",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #eee",
                  marginBottom: "8px",
                }}
              >
                <strong style={{ fontSize: "14px" }}>Notifications</strong>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: "15px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
                  No notifications yet
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      background: item.isRead ? "#fff" : "#f0f9ff",
                      marginBottom: "6px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                  >
                    <div style={{ fontWeight: "600", color: "#111827", marginBottom: "3px" }}>
                      {item.title}
                    </div>
                    <div style={{ color: "#4b5563", fontSize: "12px", marginBottom: "6px" }}>
                      {item.message}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
                      <span>{item.sourceModule || "System"}</span>
                      <div>
                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#16a34a",
                              cursor: "pointer",
                              marginRight: "8px",
                              padding: 0,
                            }}
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {user ? (
          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.fullName || "User"
                )}`}
                alt="profile"
              />

              <span>{user?.fullName || "User"}</span>

              <i className="fa-solid fa-chevron-down"></i>
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>

                <Link to="/settings">Settings</Link>

                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link className="login-btn" to="/login">
              Login
            </Link>

            <Link className="register-btn" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;