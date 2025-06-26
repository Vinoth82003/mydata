import { LogIn, UserPlus } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My Data Manager</h1>
      <p className={styles.description}>
        My Data Manager is a personal project where i can manage my personal
        details, and also project details.
      </p>
      <div className={styles.buttonGroup}>
        <a href="/signup" className={styles.primaryButton}>
          <UserPlus size={16} /> sign up
        </a>
        <a href="/signin" className={styles.secondaryButton}>
          <LogIn size={16} /> sign in
        </a>
      </div>
    </main>
  );
}
