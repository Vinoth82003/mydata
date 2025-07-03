"use client";

import { useState } from "react";
import styles from "./ForgotPassword.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getPasswordStrength = (password) => {
    if (!password) return "";

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const lengthCheck = password.length >= 8;

    const score = [
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      lengthCheck,
    ].filter(Boolean).length;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Medium";
    if (score === 5) return "Strong";
  };

  const handleSendOtp = async () => {
    if (!email) return toast.error("Email is required");
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, type: "changePassword", name: "User" }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent to email");
        setStep(2);
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter a valid 6-digit OTP");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified");
        setStep(3);
      } else {
        throw new Error(data.error || "Incorrect OTP");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // if (newPassword.length < 6) return toast.error("Password too short");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);

    try {
      const res = await fetch("/api/user/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully. Login now.");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        router.push("/signin");
      } else {
        throw new Error(data.error || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label>Enter OTP</label>
          <input
            type="text"
            placeholder="6-digit code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label>New Password</label>
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                // setPasswordStrength(getPasswordStrength(e.target.value));
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={styles.iconBtn}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* {newPassword && (
            <div className={styles.strength}>
              Strength:{" "}
              <span className={styles[passwordStrength.toLowerCase()]}>
                {passwordStrength}
              </span>
            </div>
          )} */}

          <label>Confirm Password</label>
          <div className={styles.passwordField}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className={styles.iconBtn}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
}
