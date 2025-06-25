"use client";
import styles from "./HowItWorks.module.css";
import { Sparkles, Fingerprint, Send, UserPlus, FileLock2 } from "lucide-react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className={styles.icon} />,
      title: "Step 1: Create Account",
      desc: "Quickly sign up with essential details to start your journey.",
    },
    {
      icon: <Fingerprint className={styles.icon} />,
      title: "Step 2: Sign In",
      desc: "Access your account securely using password or 2FA authentication.",
    },

    {
      icon: <FileLock2 className={styles.icon} />,
      title: "Step 3: Securely Store",
      desc: "Save and manage your data with end-to-end encryption and full privacy.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How It Works</h2>
        <p className={styles.subheading}>
          A simple 3-step process to get started and elevate your workflow.
        </p>
        <div className={styles.grid}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.card}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <div className={styles.iconWrapper}>{step.icon}</div>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
