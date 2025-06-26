"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./OTPForm.module.css";

export default function OTPForm({ email, keepSignedIn }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) return toast.error("OTP required");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, keepSignedIn }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Logged in successfully");
        // redirect or save JWT
      } else {
        toast.error(data?.error || "Invalid OTP");
      }
    } catch {
      toast.error("Verification error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Enter OTP sent to {email}</h3>
      <input
        className={styles.input}
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={loading}
      />
      <button
        className={styles.button}
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}
