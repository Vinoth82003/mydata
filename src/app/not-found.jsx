"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./not-found.module.css";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <div />
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Ghost className={styles.icon} />
        <h1 className={styles.title}>404 — Page Not Found</h1>
        <p className={styles.text}>
          Whoops! Looks like this page wandered off into the void. Let's get you
          back safely.
        </p>
        <Link href="/" className={styles.homeButton}>
          Return to Home
        </Link>
      </motion.div>
    </section>
  );
}
