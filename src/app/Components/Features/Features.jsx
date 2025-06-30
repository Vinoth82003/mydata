"use client";
import styles from "./Features.module.css";
import {
  Lock,
  FolderGit2,
  UserCog,
  CalendarClock,
  ListTodo,
  StickyNote,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function Features() {
  const features = [
    {
      icon: <Lock className={styles.icon} />,
      title: "Password Manager",
      desc: "Securely store and manage your passwords with encrypted protection and instant access.",
    },
    {
      icon: <FolderGit2 className={styles.icon} />,
      title: "Project Manager",
      desc: "Organize project details like title, description, tech stack, tags, and encrypted .env variables with easy retrieval.",
    },
    {
      icon: <UserCog className={styles.icon} />,
      title: "Editable Profile",
      desc: "Update your name, email (with OTP), password, and avatar with seamless real-time updates.",
    },
    {
      icon: <CalendarClock className={styles.icon} />,
      title: "Calendar",
      desc: "Visualize your schedule with a full-size, Microsoft Teams-style themed calendar (no participants).",
    },
    {
      icon: <ListTodo className={styles.icon} />,
      title: "To-do List",
      desc: "Track daily tasks with deadlines and completion states in a minimal productivity tool.",
    },
    {
      icon: <StickyNote className={styles.icon} />,
      title: "Notes",
      desc: "Take quick notes or store structured info with markdown-like styling and autosave.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Powerful Features</h2>
        <p className={styles.subheading}>
          Explore everything built to protect, organize, and enhance your data
          experience.
        </p>
        <div className={styles.grid}>
          {features.map((feat, i) => (
            <motion.div
              key={i}
              className={styles.card}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <div className={styles.iconWrapper}>{feat.icon}</div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
