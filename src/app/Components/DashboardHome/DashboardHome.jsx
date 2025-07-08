"use client";

import styles from "./DashboardHome.module.css";
import {
  CalendarDays,
  CheckCircle,
  FolderGit2,
  KeyRound,
  ActivitySquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function DashboardHome({ user, setActiveMenu }) {
  const [dateTime, setDateTime] = useState(new Date());
  const [summary, setSummary] = useState({
    todosToday: 0,
    upcomingEvent: null,
    passwordExpiring: false,
    projectSummary: [],
    recentActivity: [],
  });

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSummary(data.data);
        } else {
          toast.error("Failed to load dashboard");
          console.error("Dashboard fetch error", data.error);
        }
      });
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
      {/* Greeting */}
      <motion.header className={styles.header} variants={fadeUp}>
        <h1>
          Welcome back, {user.fname} {user.lname}{" "}
          <span className={styles.hi}>👋</span>
        </h1>
        <p className={styles.subtext}>
          {date} · {time}
        </p>
      </motion.header>

      {/* Summary Chips */}
      <motion.div className={styles.summaryChips} variants={fadeUp}>
        <span className={styles.chip}>
          <CheckCircle size={14} /> {summary.todosToday} task
          {summary.todosToday !== 1 ? "s" : ""} today
        </span>
        <span className={styles.chip}>
          <CalendarDays size={14} />{" "}
          {summary.upcomingEvent
            ? `Upcoming: ${summary.upcomingEvent.title}`
            : "No upcoming event"}
        </span>
        <span className={styles.chip}>
          <KeyRound size={14} />{" "}
          {summary.passwordExpiring
            ? "Password expiring soon"
            : "Passwords safe"}
        </span>
      </motion.div>

      {/* Cards */}
      <div className={styles.cardGrid}>
        {/* Upcoming Event */}
        <motion.div className={styles.card} variants={fadeUp} custom={0}>
          <div className={styles.cardHeader}>
            <CalendarDays /> Upcoming Event
          </div>
          {summary.upcomingEvent ? (
            <>
              <p className={styles.cardText}>{summary.upcomingEvent.title}</p>
              <p className={styles.cardSub}>
                {new Date(summary.upcomingEvent.start).toLocaleDateString()} ·{" "}
                {new Date(summary.upcomingEvent.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          ) : (
            <p>No upcoming events</p>
          )}
        </motion.div>

        {/* Today's Tasks */}
        <motion.div className={styles.card} variants={fadeUp} custom={1}>
          <div className={styles.cardHeader}>
            <CheckCircle /> Today's Tasks
          </div>
          <p className={styles.cardText}>
            {summary.todosToday > 0
              ? `${summary.todosToday} task${
                  summary.todosToday > 1 ? "s" : ""
                } remaining`
              : "You're all done for today!"}
          </p>
          <button
            className={styles.cardBtn}
            onClick={() => setActiveMenu("Todo")}
          >
            Go to Todo →
          </button>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          className={`${styles.card} ${styles.colSpan}`}
          variants={fadeUp}
          custom={2}
        >
          <div className={styles.cardHeader}>
            <FolderGit2 /> Active Projects
          </div>
          {summary.projectSummary.length > 0 ? (
            <div className={styles.projectList}>
              {summary.projectSummary.map((proj, i) => (
                <div className={styles.projectRow} key={i}>
                  <span>{proj.title}</span>
                  <span className={styles.accent}>{proj.envCount} envs</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No active projects found</p>
          )}
        </motion.div>
      </div>

      {/* Recent Activity Placeholder */}
      <motion.div className={styles.card} variants={fadeUp} custom={3}>
        <div className={styles.cardHeader}>
          <ActivitySquare /> Recent Activity
        </div>
        <ul className={styles.activityList}>
          {summary.recentActivity.length > 0 ? (
            summary.recentActivity.map((log, i) => (
              <li key={i}>
                <span className={styles.accent}>
                  {log.type.replace("_", " ")}
                </span>{" "}
                {log.detail}
                <span className={styles.accent} style={{ marginLeft: "20px" }}>
                  {new Date(log.updatedAt).toLocaleString("en-IN")}
                </span>{" "}
              </li>
            ))
          ) : (
            <li>No recent activity</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
