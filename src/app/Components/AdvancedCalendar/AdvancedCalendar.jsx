"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./EventModal";
import styles from "./AdvancedCalendar.module.css";
import toast from "react-hot-toast";

export default function AdvancedCalendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) return toast.error("Login required");
    setToken(storedToken);
    fetchEvents(storedToken);
  }, []);

  const fetchEvents = async (token) => {
    try {
      const res = await fetch("/api/calendar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setEvents(json.data.map((e) => ({ ...e, id: e._id })));
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.changeView(view);
  };

  const handleDateClick = (arg) => {
    setModalData({ start: arg.dateStr });
  };

  const handleEventClick = (arg) => {
    setModalData({
      ...arg.event.extendedProps,
      _id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr,
      backgroundColor: arg.event.backgroundColor,
    });
  };

  const handleEventDropResize = async ({ event }) => {
    const updated = {
      _id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      backgroundColor: event.backgroundColor,
    };
    try {
      const res = await fetch(`/api/calendar/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Event updated");
        fetchEvents(token);
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={() => handleViewChange("dayGridMonth")}>Month</button>
        <button onClick={() => handleViewChange("timeGridWeek")}>Week</button>
        <button onClick={() => handleViewChange("timeGridDay")}>Day</button>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable
        selectable
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDropResize}
        eventResize={handleEventDropResize}
        eventDisplay="block"
        height="auto"
        className={styles.fullcalendar}
        allDaySlot={true}
      />
      {modalData && (
        <EventModal
          data={modalData}
          token={token}
          onClose={() => setModalData(null)}
          refreshEvents={() => fetchEvents(token)}
        />
      )}
    </div>
  );
}
