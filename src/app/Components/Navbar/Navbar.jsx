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
            <FolderOpenDot/>
          </div>
          <span className={styles.brand}>My Data</span>
        </div>

        <div className={styles.navLinks}>
          {["Home", "Features", "About", "Contact"].map((link, idx) => (
            <a
              key={idx}
              href={`#${link.toLowerCase()}`}
              className={styles.link}
            >
              {link}
            </a>
          ))}
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
            {["Home", "Features", "About", "Contact"].map((link, idx) => (
              <a
                key={idx}
                href={`#${link.toLowerCase()}`}
                onClick={closeMenu}
                className={styles.mobileLink}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
