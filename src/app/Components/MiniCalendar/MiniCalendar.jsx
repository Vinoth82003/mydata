"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./MiniCalendar.module.css";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MiniCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.day}></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`${styles.day} ${isToday(day) ? styles.today : ""}`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navBtn}>
          <ChevronLeft size={18} />
        </button>
        <div className={styles.month}>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button onClick={nextMonth} className={styles.navBtn}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className={styles.days}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayName}>
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
}
