"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./OTPForm.module.css";
import { useRouter } from "next/navigation";

export default function OTPForm({
  email,
  keepSignedIn,
  setStep,
  isPageloader,
  setIsPageloader,
  PageLoader,
}) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!otp) return toast.error("OTP is required");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, keepSignedIn }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        setIsPageloader(true);
        localStorage.setItem("accessToken", data.accessToken);
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

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent to your email");
        setResendTimer(30);
      } else {
        toast.error(data?.error || "Failed to resend OTP");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      {isPageloader && <PageLoader />}
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
          onClick={() => setStep(1)}
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

      {/* <div className={styles.resend}>
        <button
          className={styles.resendButton}
          onClick={handleResend}
          disabled={resendTimer > 0 || resending}
        >
          {resending
            ? "Resending..."
            : resendTimer > 0
            ? `Resend in ${resendTimer}s`
            : "Resend OTP"}
        </button>
      </div> */}
    </div>
  );
}
