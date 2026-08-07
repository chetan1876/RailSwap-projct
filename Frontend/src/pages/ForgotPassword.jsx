import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../services/auth.service";
import "../styles/auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      if (step === 1) {
        const response = await authAPI.forgotPassword({ email });

        setSuccess(response.message);
        setStep(2);
      } else if (step === 2) {
        const response = await authAPI.verifyResetOtp({
          email,
          otp,
        });

        setSuccess(response.message);
        setStep(3);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const response = await authAPI.resetPassword({
          email,
          otp,
          password,
          confirmPassword,
        });

        setSuccess(response.message);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>

        <div className="step-indicator">
          <div className={step >= 1 ? "step active" : "step"}>1</div>

          <div className="line"></div>

          <div className={step >= 2 ? "step active" : "step"}>2</div>

          <div className="line"></div>

          <div className={step >= 3 ? "step active" : "step"}>3</div>
        </div>

        <p>
          {step === 1 &&
            "Enter your registered email address to receive an OTP."}

          {step === 2 &&
            "Enter the OTP sent to your registered email."}

          {step === 3 && "Create your new password."}
        </p>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="form-group">
              <label>OTP</label>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                required
              />
            </div>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label>New Password</label>

                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    required
                  />

                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    required
                  />

                  <span
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </span>
                </div>
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}

          {success && (
            <p className="success-message">{success}</p>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </button>

          <p
            className="back-login"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;