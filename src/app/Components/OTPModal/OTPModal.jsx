"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./OTPModal.module.css";

export default function OTPModal({
  name,
  title = "New Email",
  otpType, // use this to distinguish between email/password change
  type = "email", // input field type (email, password, etc.)
  onClose,
  toEmail,
  onSubmit,
}) {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendOtp = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: (otpType == "changeEmail" ? value : toEmail),
          type: otpType,
          name,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent successfully");
        setStep(2);
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const finalize = async () => {
    setIsProcessing(true);
    const success = await onSubmit(value, otp, title);
    setIsProcessing(false);

    if (success) {
      toast.success(`${title} updated`);
      onClose();
    } else {
      toast.error("Verification failed");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>{title}</h3>

        {step === 1 ? (
          <>
            <input
              type={type}
              placeholder={title}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isProcessing}
            />
            <button
              onClick={sendOtp}
              disabled={!value || isProcessing}
              className={styles.actionBtn}
            >
              {isProcessing ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isProcessing}
            />
            <button
              onClick={finalize}
              disabled={!otp || isProcessing}
              className={styles.actionBtn}
            >
              {isProcessing ? "Verifying..." : "Confirm"}
            </button>
          </>
        )}

        <button onClick={onClose} className={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
}
