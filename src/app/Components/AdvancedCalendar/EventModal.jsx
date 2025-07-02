"use client";

import { useEffect, useState } from "react";
import styles from "./AdvancedCalendar.module.css";

export default function EventModal({ data, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState("#5a9");

  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setStart(data.start || "");
      setEnd(data.end || "");
      setColor(data.backgroundColor || "#5a9");
    }
  }, [data]);

  const handleSubmit = () => {
    onSave({
      id: data.id,
      title,
      start,
      end,
      backgroundColor: color,
    });
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>{data.id ? "Edit Event" : "New Event"}</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <label>Start</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <label>End</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <label>Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <div className={styles.actions}>
          <button onClick={handleSubmit}>Save</button>
          {data.id && <button onClick={() => onDelete(data.id)}>Delete</button>}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
