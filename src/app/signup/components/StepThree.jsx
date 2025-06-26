"use client";
import { useRef, useState } from "react";
import { useSignup } from "./SignupContext";
import styles from "../Signup.module.css";
import toast from "react-hot-toast";
import { RotateCw, X } from "lucide-react";
import DOMPurify from "dompurify"; // npm install dompurify

export default function StepThree() {
  const { formData, setFormData, prevStep } = useSignup();
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

  const handleSubmit = async () => {
    setSubmitting(true);
    toast.loading("Submitting...", { id: "submit" });

    try {
      // Sanitize all user inputs
      const safeFormData = {
        fname: DOMPurify.sanitize(formData.fname.trim()),
        lname: DOMPurify.sanitize(formData.lname.trim()),
        email: DOMPurify.sanitize(formData.email.trim().toLowerCase()),
        password: formData.password, // hashed on backend, but can be trimmed
        keepSignedIn: !!formData.keepSignedIn,
        image: formData.image || null,
      };

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeFormData),
      });

      toast.dismiss("submit");

      if (res.ok) {
        toast.success("Signup Complete ");
      } else {
        const data = await res.json();
        toast.error(data?.error || "Signup failed");
      }
    } catch (err) {
      toast.dismiss("submit");
      toast.error("Something went wrong ");
      console.error(err);
    } finally {
      // Re-enable button
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
          checked={formData.keepSignedIn}
          onChange={(e) =>
            setFormData({ ...formData, keepSignedIn: e.target.checked })
          }
        />
        Keep me signed in
      </label>

      <div className={styles.actions}>
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
