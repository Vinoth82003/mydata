"use client";

import { useEffect, useRef } from "react";
import styles from "./Frame.module.css";

const Frame = ({ deg, type, }) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div");
      p.className = styles.particle;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${10 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = Math.random() * 0.4 + 0.2;
      p.style.width = p.style.height = `${10 + Math.random() * 10}px`;
      container.appendChild(p);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`animatedBackground ${styles.frame} ${type || ""}`}
      style={{ "--deg": deg || "135deg" }}
    />
  );
};

export default Frame;
