"use client";
import { useRef, useState } from "react";
import { useSignup } from "./SignupContext";
import styles from "../Signup.module.css";
import toast from "react-hot-toast";
import { RotateCw, X } from "lucide-react";
import DOMPurify from "dompurify"; // npm install dompurify
import { useRouter } from "next/navigation";

export default function StepThree() {
  const { formData, setFormData, prevStep } = useSignup();
  const router = useRouter();
  const fileRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Only image files allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImage({ target: { files: [file] } });
  };

  const handleRemove = () => {
    setFormData({ ...formData, image: null });
  };

  const handleSignup = async () => {
    setSubmitting(true);

    try {
      const {
        fname,
        lname,
        email,
        password,
        twoFaEnabled,
        image,
        keepSignedIn,
      } = formData;

      // Sanitize image (base64) in case it's injected via XSS attack
      const sanitizedImage = image ? DOMPurify.sanitize(image) : null;

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fname: DOMPurify.sanitize(fname),
          lname: DOMPurify.sanitize(lname),
          email: DOMPurify.sanitize(email),
          password, // password should not be altered
          twoFaEnabled,
          image: sanitizedImage,
          keepSignedIn,
        }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Signup successful");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Step 3: Setup Profile</h2>

      <div
        className={styles.dropzone}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        {formData.image ? (
          <div className={styles.preview}>
            <img src={formData.image} alt="Profile" />
            <div className={styles.actionsRow}>
              <button
                onClick={() => fileRef.current.click()}
                className={styles.change}
              >
                <RotateCw />
              </button>
              <button onClick={handleRemove} className={styles.remove}>
                <X />
              </button>
            </div>
          </div>
        ) : (
          <p>Drag & Drop or Click to Upload Profile Image</p>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImage}
          hidden
        />
      </div>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={formData.twoFaEnabled}
          onChange={(e) =>
            setFormData({ ...formData, twoFaEnabled: e.target.checked })
          }
        />
        Do you prefer 2FA (2 Factor Authendication) Sign in method.
      </label>

      <div className={styles.actions}>
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSignup} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
