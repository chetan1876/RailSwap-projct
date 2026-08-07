import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const OTPVerification = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card otp-card">

        <h1>OTP Verification</h1>

        <p>
          Enter 6 digit OTP sent
          to your mobile number.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            maxLength="6"
            value={otp}
            className="otp-input"
            placeholder="------"
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

          <button
            type="submit"
            className="auth-btn"
          >
            Verify OTP
          </button>

        </form>

        <button className="resend-btn">
          Resend OTP
        </button>

      </div>
    </div>
  );
};

export default OTPVerification;