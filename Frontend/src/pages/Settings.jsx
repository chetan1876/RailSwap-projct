import { useState } from "react";
import "../styles/settings.css";

const Settings = () => {

  const [darkMode, setDarkMode] = useState(false);

  const [language, setLanguage] =
    useState("English");

  const [showPasswordModal,
    setShowPasswordModal] = useState(false);

  const [showLogoutModal,
    setShowLogoutModal] = useState(false);

  const [notifications,
    setNotifications] = useState({
      push: true,
      email: true,
      sms: false,
      emergency: true,
    });

  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <div className="settings-page">

      <div className="page-header">
        <h1>Settings</h1>
        <p>
          Manage your RailSwap account,
          privacy and preferences.
        </p>
      </div>

      <div className="settings-grid">

        {/* ACCOUNT */}

        <div className="setting-card">

          <h3>👤 Account Settings</h3>

          <button>Edit Profile</button>
          <button>Change Mobile Number</button>
          <button>Change Email</button>
          <button>Verify Identity (KYC)</button>

          <button
            onClick={() =>
              setShowPasswordModal(true)
            }
          >
            Change Password
          </button>

        </div>

        {/* NOTIFICATIONS */}

        <div className="setting-card">

          <h3>🔔 Notifications</h3>

          <div className="toggle-row">
            <span>Push Notifications</span>

            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() =>
                toggleNotification("push")
              }
            />
          </div>

          <div className="toggle-row">
            <span>Email Notifications</span>

            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() =>
                toggleNotification("email")
              }
            />
          </div>

          <div className="toggle-row">
            <span>SMS Alerts</span>

            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() =>
                toggleNotification("sms")
              }
            />
          </div>

          <div className="toggle-row">
            <span>Emergency Alerts</span>

            <input
              type="checkbox"
              checked={notifications.emergency}
              onChange={() =>
                toggleNotification(
                  "emergency"
                )
              }
            />
          </div>

        </div>

        {/* SECURITY */}

        <div className="setting-card">

          <h3>🔒 Privacy & Security</h3>

          <div className="toggle-row">
            <span>
              Two Factor Authentication
            </span>

            <input
              type="checkbox"
            />
          </div>

          <p>
            Privacy Settings
          </p>

          <p>
            Blocked Users
          </p>

        </div>

        {/* APP SETTINGS */}

        <div className="setting-card">

          <h3>🎨 App Preferences</h3>

          <div className="toggle-row">

            <span>Dark Mode</span>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() =>
                setDarkMode(!darkMode)
              }
            />

          </div>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }
          >
            <option>
              English
            </option>

            <option>
              Hindi
            </option>

            <option>
              Bengali
            </option>

            <option>
              Tamil
            </option>
          </select>

        </div>

        {/* DEVICE MANAGEMENT */}

        <div className="setting-card">

          <h3>💻 Device Management</h3>

          <div className="device-row">
            <span>
              Chrome - Windows 11
            </span>

            <strong>
              Active Now
            </strong>
          </div>

          <div className="device-row">
            <span>
              Samsung Android
            </span>

            <strong>
              2 Days Ago
            </strong>
          </div>

        </div>

        {/* SECURITY ACTIVITY */}

        <div className="setting-card">

          <h3>🛡 Security Activity</h3>

          <ul>

            <li>
              Login From Chrome
              (10 min ago)
            </li>

            <li>
              Password Changed
              (2 days ago)
            </li>

            <li>
              New Device Login
              (5 days ago)
            </li>

          </ul>

        </div>

        {/* REWARDS */}

        <div className="setting-card">

          <h3>💎 Rewards</h3>

          <p>
            Reward Points: 2450
          </p>

          <p>
            Membership: Gold
          </p>

          <p>
            Referral:
            CHETAN2026
          </p>

        </div>

        {/* ABOUT */}

        <div className="setting-card">

          <h3>ℹ️ About</h3>

          <p>
            App Version: 1.0.0
          </p>

          <p>
            Terms & Conditions
          </p>

          <p>
            Privacy Policy
          </p>

          <button
            className="logout-btn"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >
            Logout
          </button>

        </div>

      </div>

      {/* PASSWORD MODAL */}

      {showPasswordModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Change Password
            </h2>

            <input
              type="password"
              placeholder="Old Password"
            />

            <input
              type="password"
              placeholder="New Password"
            />

            <button>
              Update Password
            </button>

            <button
              onClick={() =>
                setShowPasswordModal(false)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* LOGOUT MODAL */}

      {showLogoutModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Logout?
            </h2>

            <p>
              Are you sure you want
              to logout?
            </p>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href =
                  "/login";
              }}
            >
              Yes Logout
            </button>

            <button
              onClick={() =>
                setShowLogoutModal(false)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Settings;