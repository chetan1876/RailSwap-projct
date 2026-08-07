import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

import { authAPI } from "../services/auth.service";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  /* =====================================================
                      STATES
  ===================================================== */

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // Part 2 me use hoga
  const [showOTPBox, setShowOTPBox] =
    useState(false);

  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  /* =====================================================
                  INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Full Name
  if (name === "fullName") {
    if (!/^[A-Za-z\s]*$/.test(value)) return;
    if (value.length > 50) return;
  }

  // Email
  if (name === "email") {
    if (!/^[A-Za-z0-9@._-]*$/.test(value)) return;
    if (value.length > 100) return;
  }

  // Phone Number
  if (name === "phoneNumber") {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 10) return;
  }

  // Password Validation
if (name === "password" || name === "confirmPassword") {

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
                REGISTER SUBMIT
  ===================================================== */

  const handleRegister = async (e) => {

  e.preventDefault();

  setError("");
  setSuccess("");

  // Check all fields
  if (
    !formData.fullName ||
    !formData.email ||
    !formData.phoneNumber ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError("Please fill all fields.");
    return;
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email.trim())) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
    setError("Please enter a valid 10-digit Indian mobile number.");
    return;
  }
  // Password Validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,20}$/;

if (!passwordRegex.test(formData.password)) {

  setError(
    "Password must be 8-20 characters and include uppercase, lowercase, number and special character."
  );

  return;

}
  
  // Password Match
  if (formData.password !== formData.confirmPassword) {
  setError("Passwords do not match.");
  return;
}

  try {

    setLoading(true);

    const response = await authAPI.register(formData);

    if (response.success) {

      setSuccess(
        response.message ||
        "Registration successful. OTP has been sent to your email."
      );

      setShowOTPBox(true);

    } else {

      setError(
        response.message ||
        "Registration failed."
      );

    }

  } catch (error) {

    setError(
      error.message ||
      "Something went wrong."
    );

  } finally {

    setLoading(false);

  }

};

const handleGoogleRegister = async (credentialResponse) => {
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
      "Google Registration Failed."
    );

  } finally {
    setLoading(false);
  }
};


  /* =====================================================
                VERIFY OTP
===================================================== */

const handleVerifyOTP = async (e) => {

  e.preventDefault();

  setError("");
  setSuccess("");

  if (!otp) {
    setError("Please enter OTP.");
    return;
  }

  try {

    setLoading(true);

    const verifyResponse = await authAPI.verifyOtp({
      email: formData.email,
      otp,
    });

    if (!verifyResponse.success) {

      setError(
        verifyResponse.message ||
        "OTP verification failed."
      );

      return;
    }

    const loginResponse = await authAPI.login({
      email: formData.email,
      password: formData.password,
    });

    if (!loginResponse.success) {

      setError(
        loginResponse.message ||
        "Login failed."
      );

      return;
    }

    login(loginResponse.data);

    navigate("/dashboard");

  } catch (error) {

    setError(
      error.message ||
      "Something went wrong."
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

      <div className="auth-card">

        <h2>Create Account</h2>

        <p>
          Create your RailSwap account
        </p>

        {/* OTP UI Part 2 me aayega */}
        {!showOTPBox && (

          <form
            onSubmit={handleRegister}
          >

            <div className="input-group">

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={50}
                autoComplete="name"
              />

            </div>

            <div className="input-group">

              <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="email"
              />

            </div>

            <div className="input-group">
              <span className="country-code">+91</span>

              <input
                type="text"
                name="phoneNumber"
                placeholder="9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
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

            <div className="input-group password-group">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
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

            {success && (
              <p className="success-message">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

            <div
  style={{
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
  }}
>
  <hr style={{ flex: 1 }} />
  <span style={{ margin: "0 10px", color: "#777" }}>
    OR
  </span>
  <hr style={{ flex: 1 }} />
</div>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  }}
>
  <GoogleLogin
    onSuccess={handleGoogleRegister}
    onError={() =>
      setError("Google Registration Failed.")
    }
    theme="outline"
    size="large"
    shape="pill"
    width="320"
  />
</div>

            <div className="auth-footer">

              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </div>

          </form>

        )}

        {/* OTP Section Part 2 */}
        {/* =====================================================
                    OTP SECTION
===================================================== */}

{showOTPBox && (

  <form onSubmit={handleVerifyOTP}>

    <h2>Email Verification</h2>

    <p>
      Enter the OTP sent to
      <br />
      <strong>{formData.email}</strong>
    </p>

    <div className="input-group">

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />

    </div>

    {error && (
      <p className="error-message">
        {error}
      </p>
    )}

    {success && (
      <p className="success-message">
        {success}
      </p>
    )}

    <button
      type="submit"
      className="auth-btn"
      disabled={loading}
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </button>

    <button
      type="button"
      className="auth-btn"
      onClick={async () => {

        try {

          const response =
            await authAPI.resendOtp({
              email: formData.email,
            });

          setError("");
          setSuccess(
            response.message ||
            "OTP sent successfully."
          );

        } catch (error) {

          setSuccess("");
          setError(
            error.message ||
            "Unable to resend OTP."
          );

        }

      }}
    >
      Resend OTP
    </button>

    <div className="auth-footer">

      <button
        type="button"
        className="link-btn"
        onClick={() => {

          setShowOTPBox(false);

          setOtp("");

        }}
      >
        Back
      </button>

    </div>

  </form>

)}

     
        
      </div>

    </div>
  );
}

export default Register;