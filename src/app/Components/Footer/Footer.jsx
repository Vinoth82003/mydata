"use client";
import styles from "./Footer.module.css";
import {
  FolderDot,
  FolderOpenDot,
  Github,
  Globe,
  Linkedin,
  Mail,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h2 className={styles.footerLogo}>
          Data Manager
          <FolderOpenDot size={24} style={{ marginLeft: "10px" }} />
        </h2>

        <nav className={styles.footerNav}>
          <a href="/" className={styles.footerLink}>
            Home
          </a>
          <a href="/contact" className={styles.footerLink}>
            Contact
          </a>
          <a href="/signup" className={styles.footerLink}>
            sign up
          </a>
          <a href="/signin" className={styles.footerLink}>
            sign in
          </a>
        </nav>

        <div className={styles.footerSocial}>
          <a
            href="https://github.com/Vinoth82003"
            target="_blank"
            className={styles.socialIcon}
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/vinoth82003"
            target="_blank"
            className={styles.socialIcon}
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:vinothg0618@gmail.com"
            className={styles.socialIcon}
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
          <a
            href="https://vinoths.vercel.app/"
            className={styles.socialIcon}
            aria-label="Portfolio"
            target="_blank"
          >
            <Globe size={20} />
          </a>
        </div>

        <p className={styles.footerNote}>
          &copy; {year} Data Manager — Developed by <strong>Vinoth S</strong>
        </p>
      </div>
    </footer>
  );
}
