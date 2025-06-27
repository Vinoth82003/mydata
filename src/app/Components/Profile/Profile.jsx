"use client";
import { useState, useRef } from "react";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import { Camera, X } from "lucide-react";
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
    setIsSaving(true);
    const cleanF = DOMPurify.sanitize(fname);
    const cleanL = DOMPurify.sanitize(lname);
    const cleanImage = image?.startsWith("data:image/") ? image : null; // Only send if it's a base64 image

    const payload = {
      fname: cleanF,
      lname: cleanL,
      ...(cleanImage && { image: cleanImage }),
      twoFaEnabled,
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
          <label>First Name</label>
          <input value={fname} onChange={(e) => setFname(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Last Name</label>
          <input value={lname} onChange={(e) => setLname(e.target.value)} />
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleSaveName}
          disabled={isSaving}
        >
          {isSaving ? "Saving Changes....." : "Save Changes"}
        </button>

        {/* <div className={styles.field}>
          <label>Keep me Sign-in</label>
          <div className={styles.readonly}>
            <span>{twoFaEnabled ? "Remember me" : "Forget me"}</span>
            <button onClick={() => setTwoFaEnabled(!twoFaEnabled)}>
              {twoFaEnabled ? "Forget" : "Remember"}
            </button>
          </div>
        </div> */}
        <div className={styles.field}>
          <label>Multi-factor Authendication</label>
          <div className={styles.readonly}>
            <span>
              {twoFaEnabled
                ? "Want to Disable 2FA Authendication ?"
                : "Want to Enable 2FA Authendication ?"}
            </span>
            <button onClick={() => setTwoFaEnabled(!twoFaEnabled)}>
              {twoFaEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <div className={styles.readonly}>
            <span>{user.email}</span>
            <button onClick={() => setEmailModal(true)}>Change</button>
          </div>
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <div className={styles.readonly}>
            <span>••••••••</span>
            <button onClick={() => setPassModal(true)}>Change</button>
          </div>
        </div>
      </div>

      {emailModal && (
        <OTPModal
          title="Change Email"
          onClose={() => setEmailModal(false)}
          onSubmit={async (newVal, otp) =>
            await updateUser({ email: newVal, otp })
          }
        />
      )}
      {passModal && (
        <OTPModal
          title="Change Password"
          type="password"
          onClose={() => setPassModal(false)}
          onSubmit={async (newVal, otp) =>
            await updateUser({ password: newVal, otp })
          }
        />
      )}
    </div>
  );
}
