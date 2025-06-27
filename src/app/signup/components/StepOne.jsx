"use client";
import { useState } from "react";
import { useSignup } from "./SignupContext";
import styles from "../Signup.module.css";
import { MoveRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function StepOne() {
  const { formData, setFormData, nextStep } = useSignup();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = async () => {
    const { fname, lname, email, password, confirm } = formData;

    if (!fname || !lname || !email || !password || !confirm) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setDisabled(true);
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, type: "verification", name: fname }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP sent successfully to email");
        nextStep();
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.message);
      setDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <div className={styles.container}>
      <h2>Step 1: Your Details</h2>

      <div className={styles.inputGroup}>
        <div className={styles.row}>
          <input
            name="fname"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.fname}
            disabled={disabled}
          />
          <input
            name="lname"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.lname}
            disabled={disabled}
          />
        </div>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          disabled={disabled}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          disabled={disabled}
        />
        <input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={formData.confirm}
          disabled={disabled}
        />
      </div>

      <div className={styles.actions}>
        <button onClick={handleNext} disabled={loading}>
          {loading ? "Sending OTP..." : "Next"}
          {!loading && (
            <span>
              <MoveRight />
            </span>
          )}
        </button>
      </div>

      <p className={styles.orText}>or</p>
      <div className={styles.linkwarpper}>
        Already have an account?
        <a href="/signin" className={styles.link}>
          Sign in
        </a>
      </div>
      <div className={styles.googleBtnWrapper}>
        <button className={styles.googleBtn} onClick={handleGoogleSignup}>
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
