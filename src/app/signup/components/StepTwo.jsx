"use client";
import { useEffect, useState } from "react";
import { useSignup } from "./SignupContext";
import styles from "../Signup.module.css";
import toast from "react-hot-toast";

export default function StepTwo() {
  const { formData, setFormData, nextStep, prevStep } = useSignup();
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        
        toast.success("OTP verified");
        nextStep();
      } else {
        if (data.error?.includes("expired")) {
          toast.error("OTP expired. Please request a new one.");
        } else {
          toast.error(data.error || "Verification failed");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("OTP resent!");
        setTimer(30); // cooldown in seconds
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Error sending OTP");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={styles.container}>
      <h2>Step 2: Verify Email</h2>
      <p className={styles.description}>We've sent a 6-digit OTP to:</p>
      <p className={styles.email}>{formData.email}</p>
      <p className={styles.otpNote}>
        <strong>Note:</strong> The OTP will expire in <span>5 minutes</span>.
        Please verify your email before it expires.
      </p>

      <div className={styles.inputGroup}>
        <input
          name="otp"
          placeholder="Enter OTP"
          onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
          disabled={verifying}
        />
      </div>

      <div className={styles.actions}>
        <button onClick={prevStep} disabled={verifying || resending}>
          Back
        </button>
        <button onClick={handleVerify} disabled={verifying || resending}>
          {verifying ? "Verifying..." : "Verify"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          className={styles.resendButton}
          onClick={handleResend}
          disabled={resending || timer > 0}
        >
          {resending
            ? "Sending..."
            : timer > 0
            ? `Resend in 00:${String(timer).padStart(2, "0")}`
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
