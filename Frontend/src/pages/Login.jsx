import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/auth.service";

import "../styles/auth.css";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  /* =====================================================
                      STATES
  ===================================================== */

  const [formData, setFormData] = useState({

    email: "",

    password: "",

  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);
  

  const [error, setError] =
    useState("");
  /* =====================================================
                  INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {

  const { name, value } = e.target;

  /* =====================================
              EMAIL VALIDATION
  ===================================== */

  if (name === "email") {

    // Space allow nahi hoga
    if (/\s/.test(value)) {
      return;
    }

    // Sirf valid email characters allow
    if (!/^[A-Za-z0-9@._+-]*$/.test(value)) {
      return;
    }

    // Maximum 100 characters
    if (value.length > 100) {
      return;
    }

  }

  /* =====================================
            PASSWORD VALIDATION
  ===================================== */

  if (name === "password") {

    // Maximum 20 characters
    if (value.length > 20) {
      return;
    }

  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setError("");

};

  /* =====================================================
                    LOGIN
  ===================================================== */

 const handleLogin = async (e) => {

  e.preventDefault();

  setError("");

  if (!formData.email || !formData.password) {

    setError("Please fill all fields.");

    return;

  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email.trim())) {

    setError("Please enter a valid email address.");

    return;

  }

  try {

    setLoading(true);

    const response = await authAPI.login(formData);

    if (!response.success) {

      setError(response.message || "Login failed.");

      return;

    }

    login(response.data);

    navigate("/dashboard");

  } catch (error) {

    setError(error.message || "Something went wrong.");

  } finally {

    setLoading(false);

  }

};

/* =====================================================
                GOOGLE LOGIN
===================================================== */

const handleGoogleLogin = async (credentialResponse) => {

  try {

    setLoading(true);

    setError("");

    const response = await authAPI.googleLogin(
      credentialResponse.credential
    );

    if (!response.success) {

      setError(response.message);

      return;

    }

    login(response.data);

    navigate("/dashboard");

  } catch (error) {

    setError(

      error.response?.data?.message ||

      error.message ||

      "Google Login Failed."

    );

  } finally {

    setLoading(false);

  }

};

  /* =====================================================
                        UI
  ===================================================== */

 return (
  <div className="auth-container">

    {/* ================= LEFT SIDE ================= */}

    <div className="auth-left">

     <div className="auth-left-card">

      <div className="brand-logo">
        🚆 RailSwap
      </div>

      <h1>
        Travel Smarter,
        <br />
        Exchange Seats
        <br />
        Seamlessly.
      </h1>

      <p>
        India's AI-powered railway seat exchange platform
        built to help passengers find better seats,
        verified travel companions and smart journey
        assistance in real time.
      </p>

      <div className="feature-list">

        <div className="feature-item">
          ✅ AI Seat Recommendation
        </div>

        <div className="feature-item">
          ✅ Secure Authentication
        </div>

        <div className="feature-item">
          ✅ PNR Verification
        </div>

        <div className="feature-item">
          ✅ Journey Companion
        </div>

        <div className="feature-item">
          ✅ Emergency Assistance
        </div>

        </div>

      </div>


    </div>

    {/* ================= RIGHT SIDE ================= */}

    <div className="auth-right">

      <div className="auth-card">

        <h2>Welcome Back</h2>

        <p>Login to your RailSwap account</p>

        <form onSubmit={handleLogin}>

          <div className="input-group">

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-group password-group">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <div className="auth-links">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* ================= Divider ================= */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
  }}
>

  <hr style={{ flex: 1 }} />

  <span
    style={{
      margin: "0 10px",
      color: "#777",
      fontSize: "14px",
    }}
  >
    OR
  </span>

  <hr style={{ flex: 1 }} />

</div>

{/* ================= Google Login ================= */}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  }}
>

  <GoogleLogin

    onSuccess={handleGoogleLogin}

    onError={() =>
      setError("Google Login Failed.")
    }

    theme="outline"

    size="large"

    shape="pill"

    width="320"

  />

</div>

          <div className="auth-footer">

            Don't have an account?

            <Link to="/register">
              Register
            </Link>

          </div>

        </form>

      </div>

    </div>

  </div>
);

}

export default Login;