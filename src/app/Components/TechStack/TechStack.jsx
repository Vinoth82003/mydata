"use client";
import styles from "./TechStack.module.css";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  FileUp,
  CalendarClock,
  StickyNote,
  Database,
  Cpu,
} from "lucide-react";

const techList = [
  {
    icon: <ShieldCheck className={styles.icon} />,
    title: "Jwt Auth",
    desc: "Manages secure authentication and session handling with email OTP.",
  },
  {
    icon: <KeyRound className={styles.icon} />,
    title: "Email OTP + Nodemailer",
    desc: "Implements passwordless login using secure one-time email codes.",
  },
  {
    icon: <Lock className={styles.icon} />,
    title: "Crypto & AES",
    desc: "Encrypts passwords, sensitive files, and user data end-to-end.",
  },
  {
    icon: <FileUp className={styles.icon} />,
    title: "Vercel Blob",
    desc: "Enables secure upload and download of project environment files.",
  },
  {
    icon: <CalendarClock className={styles.icon} />,
    title: "Customer Calendar",
    desc: "Integrates event syncing and reminders within your dashboard.",
  },
  {
    icon: <StickyNote className={styles.icon} />,
    title: "Custom To-Do",
    desc: "Create and track encrypted tasks and notes securely in your workspace.",
  },
  {
    icon: <Database className={styles.icon} />,
    title: "MongoDB + Mongoose",
    desc: "NoSQL database for encrypted user data, file metadata, and tokens.",
  },
  {
    icon: <Cpu className={styles.icon} />,
    title: "Dompurify",
    desc: "Dompurify to sanitize the user input to frontend security.",
  },
];

export default function TechStack() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Tech Stack</h2>
        <p className={styles.subheading}>
          Tools and technologies powering our secure & modern application.
        </p>
        <div className={styles.grid}>
          {techList.map((tech, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className={styles.iconWrapper}>{tech.icon}</div>
              <h3 className={styles.cardTitle}>{tech.title}</h3>
              <p className={styles.cardDesc}>{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
