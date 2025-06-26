"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./OTPForm.module.css";
import { useRouter } from "next/navigation";

export default function OTPForm({ email, keepSignedIn, setStep }) {
  const router = useRouter();
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
      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Logged in successfully");
        router.push("/dashboard");
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
      <p className={styles.title}>Enter OTP sent to</p>
      <p className={styles.email}>{email}</p>
      <input
        className={styles.input}
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={loading}
      />
      <div className={styles.buttonGroup}>
        <button
          className={styles.button}
          onClick={() => {
            setStep(1);
          }}
          disabled={loading}
        >
          Back
        </button>
        <button
          className={styles.button}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
