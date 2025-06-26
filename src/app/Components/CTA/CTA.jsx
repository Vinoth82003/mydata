"use client";
import { motion } from "framer-motion";
import styles from "./CTA.module.css";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function CTA() {
  return (
    <section className={styles.ctaWrapper}>
      <div className={styles.overlay} />
      <motion.div
        className={styles.ctaContent}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ShieldCheck className={styles.icon} />
        <h2 className={styles.heading}>Protect What Matters Most</h2>
        <p className={styles.subheading}>
          Secure your passwords, files, tasks, and projects in one encrypted
          dashboard — trusted, private, and powerful.
        </p>
        <Link href="/signup" className={styles.ctaButton}>
          Start Securing Now
        </Link>
      </motion.div>
    </section>
  );
}
