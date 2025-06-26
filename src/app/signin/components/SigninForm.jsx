"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import OTPForm from "./OTPForm";
import styles from "./SigninForm.module.css";

export default function SigninForm() {
  const router = useRouter(); 
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password, keepSignedIn }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        if (data.requiresOtp) {
          toast.success("OTP sent to email");
          setStep(2);
        } else {
          if (data.token) {
            localStorage.setItem("token", data.token);
            toast.success("Logged in successfully");
            router.push("/dashboard");
          } else {
            toast.error("No token received");
          }
        }
      } else {
        toast.error(data?.error || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return step === 1 ? (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign In</h2>
      <input
        type="email"
        className={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <div className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={keepSignedIn}
          onChange={(e) => setKeepSignedIn(e.target.checked)}
          disabled={loading}
        />
        <label>Keep me signed in</label>
      </div>
      <button
        className={styles.button}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Continue"}
      </button>

      <p className={styles.orText}>or</p>
      <div className={styles.linkwarpper}>
        New here?{" "}
        <a href="/signup" className={styles.link}>
          Create an account
        </a>
      </div>
    </div>
  ) : (
    <OTPForm email={email} keepSignedIn={keepSignedIn} setStep={setStep} />
  );
}
