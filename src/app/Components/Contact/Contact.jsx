"use client";
import { useEffect, useState } from "react";
import styles from "./Contact.module.css";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import PageLoader from "../PageLoader/PageLoader";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  });

  const isValid = form.name && form.email && form.message;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      // Replace this with your backend endpoint
      await new Promise((res) => setTimeout(res, 2000));
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      {isLoading && <PageLoader />}
      <div className={styles.textBlock}>
        <h2>Get in Touch</h2>
        <p>Feel free to ask me anything or reach out for collaboration 🚀</p>
        <ul className={styles.links}>
          <li>
            <Mail />{" "}
            <a href="mailto:vinothg0618@gmail.com">vinothg0618@gmail.com</a>
          </li>
          <li>
            <Phone /> <a href="tel:+919384460843">+91 93844 60843</a>
          </li>
          <li>
            <Linkedin />{" "}
            <a href="https://linkedin.com/in/vinoth82003" target="_blank">
              linkedin.com/in/vinoth82003
            </a>
          </li>
          <li>
            <Github />{" "}
            <a href="https://github.com/Vinoth82003" target="_blank">
              github.com/Vinoth82003
            </a>
          </li>
          <li>
            <ExternalLink />{" "}
            <a href="https://vinoths.vercel.app/" target="_blank">
              vinoths.vercel.app
            </a>
          </li>
          <li>
            <MapPin /> Chennai, Tamil Nadu, India
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={!isValid || loading}>
          {loading ? (
            <>
              <Loader2 className={styles.loader} />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </section>
  );
}
