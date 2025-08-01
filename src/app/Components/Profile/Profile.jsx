"use client";
import { useState, useRef } from "react";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import {
  Camera,
  X,
  ShieldCheck,
  ShieldOff,
  Mail,
  Lock,
  Pencil,
  User2Icon,
} from "lucide-react";
import styles from "./Profile.module.css";
import OTPModal from "../OTPModal/OTPModal";

export default function Profile({ user, updateUser }) {
  const [fname, setFname] = useState(user.fname);
  const [lname, setLname] = useState(user.lname);
  const [image, setImage] = useState(user.image);
  const [twoFaEnabled, setTwoFaEnabled] = useState(user.twoFaEnabled);
  // const [twoFaEnabled, setTwoFaEnabled] = useState(user.twoFaEnabled);
  const [emailModal, setEmailModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef();

  const getInitials = () =>
    (user.fname[0] + (user.lname[0] || "")).toUpperCase();

  const getColor = (name) => {
    let hash = 0;
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 60%, 40%)`;
  };

  const handleSaveName = async () => {
    const cleanF = DOMPurify.sanitize(fname);
    const cleanL = DOMPurify.sanitize(lname);

    const hasChanges =
      cleanF !== user.fname ||
      cleanL !== user.lname ||
      image !== user.image ||
      twoFaEnabled !== user.twoFaEnabled;

    if (!hasChanges) {
      toast("No changes to update");
      return;
    }

    setIsSaving(true);

    const payload = {
      ...(cleanF !== user.fname && { fname: cleanF }),
      ...(cleanL !== user.lname && { lname: cleanL }),
      ...({ image: image }),
      ...(twoFaEnabled !== user.twoFaEnabled && { twoFaEnabled }),
    };

    await updateUser(payload);
    toast.success("Profile updated");
    setIsSaving(false);
  };

  const handlePhoto = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid file");
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    fileRef.current.value = null;
  };

  const onSubmit = async (value, otp, title) => {
    try {
      const res = await fetch("/api/user/changeViaOtp", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          type: title === "New Email" ? "changeEmail" : "changePassword",
          [title === "New Email" ? "newEmail" : "newPassword"]: value,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Refresh user data from backend
        const userRes = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const userData = await userRes.json();
        if (userRes.ok) {
          updateUser(userData.user); // 🔁 Update user state
        }
        return true;
      } else {
        toast.error(data.error || "Verification failed");
        return false;
      }
    } catch (err) {
      console.error("OTP submit error:", err);
      toast.error("Something went wrong");
      return false;
    }
  };

  return (
    <div className={`${styles.profileCard}`}>
      <div className={styles.photoSection}>
        {image ? (
          <div className={styles.photoWrapper}>
            <img src={image} alt="Profile" />
            <button
              onClick={() => fileRef.current.click()}
              title="Change photo"
            >
              <Camera size={20} />
            </button>
            <button onClick={handleRemoveImage} title="Remove photo">
              <X size={20} />
            </button>
          </div>
        ) : (
          <div
            className={styles.initials}
            style={{ backgroundColor: getColor(user.email) }}
            onClick={() => fileRef.current.click()}
          >
            <button className={styles.chButton}>
              <Camera size={20} />
            </button>
            <span>{getInitials()}</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handlePhoto}
          hidden
        />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.field}>
          <label>
            <User2Icon size={16} style={{ marginRight: 4 }} />
            First Name
          </label>
          <input value={fname} onChange={(e) => setFname(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>
            <User2Icon size={16} style={{ marginRight: 4 }} />
            Last Name
          </label>
          <input value={lname} onChange={(e) => setLname(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="twofa">
            <ShieldCheck size={16} style={{ marginRight: 4 }} />
            Two-Factor Authentication
          </label>
          <div className={styles.readonly} id="twofa">
            <span>
              {twoFaEnabled
                ? "2FA is currently enabled for extra security."
                : "2FA is currently disabled. Enable it for more protection."}
            </span>
            <button onClick={() => setTwoFaEnabled(!twoFaEnabled)}>
              {twoFaEnabled ? (
                <>
                  <ShieldOff size={16} style={{ marginRight: 4 }} />
                  Disable 2FA
                </>
              ) : (
                <>
                  <ShieldCheck size={16} style={{ marginRight: 4 }} />
                  Enable 2FA
                </>
              )}
            </button>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="email">
            <Mail size={16} style={{ marginRight: 4 }} />
            Email Address
          </label>
          <div className={styles.readonly} id="email">
            <span>{user.email}</span>
            <button
              onClick={() => setEmailModal(true)}
              aria-label="Change Email"
              title="Change Email"
            >
              Change
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="password">
            <Lock size={16} style={{ marginRight: 4 }} />
            Password
          </label>
          <div className={styles.readonly} id="password">
            <span>••••••••</span>
            <button
              onClick={() => setPassModal(true)}
              aria-label="Change Password"
              title="Change Password"
            >
              Change
            </button>
          </div>
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleSaveName}
          disabled={isSaving}
        >
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

      {emailModal && (
        <OTPModal
          name={user.fname}
          title="New Email"
          otpType="changeEmail"
          type="email"
          onClose={() => setEmailModal(false)}
          onSubmit={onSubmit}
        />
      )}

      {passModal && (
        <OTPModal
          name={user.fname}
          title="Change Password"
          otpType="changePassword"
          type="password"
          toEmail={user.email}
          onClose={() => setPassModal(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
