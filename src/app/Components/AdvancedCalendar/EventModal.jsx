"use client";

import { useEffect, useState } from "react";
import styles from "./AdvancedCalendar.module.css";
import toast from "react-hot-toast";

export default function EventModal({ data, token, onClose, refreshEvents }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState("#5a9");
  const [isAllDay, setIsAllDay] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setStart(data.start || "");
      setEnd(data.end || "");
      setColor(data.backgroundColor || "#5a9");
      setIsAllDay(data.allDay || false);
    }
  }, [data]);

  const validate = () => {
    if (!title.trim()) return "Title is required";
    if (!start || !end) return "Start and end time are required";
    if (new Date(start) >= new Date(end)) return "End must be after start";
    return null;
  };

  const getTodayMin = () => {
    const now = new Date();
    return isAllDay
      ? now.toISOString().split("T")[0]
      : now.toISOString().slice(0, 16);
  };

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);

    const startDate = new Date(newStart);
    const endDate = new Date(end);

    if (!end || startDate >= endDate) {
      const adjusted = new Date(startDate);
      if (!isAllDay) adjusted.setHours(adjusted.getHours() + 1);
      setEnd(
        isAllDay
          ? adjusted.toISOString().split("T")[0]
          : adjusted.toISOString().slice(0, 16)
      );
    }
  };

  const handleSave = async () => {
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    const payload = {
      title,
      start,
      end,
      backgroundColor: color,
      allDay: isAllDay,
    };

    const isUpdate = data._id;

    try {
      const res = await fetch(
        `/api/calendar${isUpdate ? `/${data._id}` : ""}`,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success(isUpdate ? "Event updated" : "Event created");
      refreshEvents();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!data._id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar/${data._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Event deleted");
      refreshEvents();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>{data._id ? "Edit Event" : "New Event"}</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <label>Start</label>
        <input
          type={isAllDay ? "date" : "datetime-local"}
          value={start}
          onChange={handleStartChange}
          min={getTodayMin()}
        />

        <label>End</label>
        <input
          type={isAllDay ? "date" : "datetime-local"}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          min={start}
        />

        <label>Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label className={styles.allDayToggle}>
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
          />
          All Day
        </label>

        <div className={styles.actions}>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          {data._id && (
            <button onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          )}

          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
