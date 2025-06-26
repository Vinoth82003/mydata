"use client";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { FolderOpenDot, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <FolderOpenDot />
          </div>
          <span className={styles.brand}>My Data</span>
        </div>

        <div className={styles.navLinks}>
          <a href={"/"} className={styles.link}>
            Home
          </a>
          <a href={"/contact"} className={styles.link}>
            Contact
          </a>
          <a href={"/signup"} className={styles.link}>
            Sign up
          </a>
          <a href={"/signin"} className={styles.link}>
            Sign in
          </a>
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          <Menu size={24} />
        </button>
      </nav>

      {isOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileMenu}>
            <button className={styles.closeButton} onClick={closeMenu}>
              <X size={24} />
            </button>
            <a href={"/"} className={styles.mobileLink}>
              Home
            </a>
            <a href={"/contact"} className={styles.mobileLink}>
              Contact
            </a>
            <a href={"/signup"} className={styles.mobileLink}>
              Sign up
            </a>
            <a href={"/signin"} className={styles.mobileLink}>
              Sign in
            </a>
          </div>
        </div>
      )}
    </>
  );
}
