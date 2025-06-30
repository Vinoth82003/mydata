"use client";

import styles from "./DashboardHome.module.css";
import { CalendarDays, CheckCircle, FolderGit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DashboardHome({ user }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const date = dateTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const time = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <motion.div
      className={styles.wrapper}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <motion.header className={styles.header} variants={fadeUp}>
        <h1>
          Welcome back, {user.fname + " " + user.lname}{" "}
          <span className={styles.hi}>👋</span>
        </h1>
        <p className={styles.subtext}>
          {date} · {time}
        </p>
      </motion.header>

      <motion.div className={styles.summaryChips} variants={fadeUp}>
        <span className={styles.chip}>3 tasks due today</span>
        <span className={styles.chip}>1 upcoming event</span>
        <span className={styles.chip}>1 password expiring soon</span>
      </motion.div>

      <div className={styles.cardGrid}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`${styles.card} ${i === 2 ? styles.colSpan : ""}`}
            custom={i}
            variants={fadeUp}
          >
            {i === 0 && (
              <>
                <div className={styles.cardHeader}>
                  <CalendarDays /> Upcoming Event
                </div>
                <p className={styles.cardText}>Design review call</p>
                <p className={styles.cardSub}>Today · 4:00 PM</p>
              </>
            )}

            {i === 1 && (
              <>
                <div className={styles.cardHeader}>
                  <CheckCircle /> Today's Todos
                </div>
                <p className={styles.cardText}>
                  Finish .env update for Food App
                </p>
                <button className={styles.cardBtn}>Go to Todo →</button>
              </>
            )}

            {i === 2 && (
              <>
                <div className={styles.cardHeader}>
                  <FolderGit2 /> Active Projects
                </div>
                <div className={styles.projectList}>
                  <div className={styles.projectRow}>
                    <span>Portfolio Website</span>
                    <span>3 envs</span>
                  </div>
                  <div className={styles.projectRow}>
                    <span>E-commerce Site</span>
                    <span>5 envs</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div className={styles.card} variants={fadeUp} custom={3}>
        <div className={styles.cardHeader}>Recent Activity</div>
        <ul className={styles.activityList}>
          <li>
            <span className={styles.accent}>Added</span> .env.backend to ‘Food
            App’
          </li>
          <li>
            <span className={styles.accent}>Updated password</span> for MongoDB
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
