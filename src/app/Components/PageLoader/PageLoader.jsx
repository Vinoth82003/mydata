"use client";
import { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

const subtitles = ["Encrypting", "Validating", "Initializing"];

export default function PageLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % subtitles.length);
    }, 1500); // 1.5s per word
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.loaderCard}>
        <div className={styles.ring}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h2 className={styles.title}>Loading Secure Environment...</h2>
        <p className={styles.subtitle}>{subtitles[index]}...</p>
      </div>
    </div>
  );
}
