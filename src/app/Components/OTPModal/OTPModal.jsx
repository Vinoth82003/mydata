"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./OTPModal.module.css";

export default function OTPModal({
  title = "Change",
  type = "email",
  onClose,
  onSubmit,
}) {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    // trigger email OTP &&
    toast.success("OTP sent");
    setStep(2);
  };

  const finalize = async () => {
    const ok = await onSubmit(value, otp);
    if (ok) {
      toast.success(`${title} updated`);
      onClose();
    } else toast.error("Failed");
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
            />
            <button disabled={!value} onClick={sendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button disabled={!otp} onClick={finalize}>
              Confirm
            </button>
          </>
        )}
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
