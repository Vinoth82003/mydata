"use client";

import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./EventModal";
import styles from "./AdvancedCalendar.module.css";

export default function AdvancedCalendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Daily Standup",
      start: new Date().toISOString().slice(0, 10) + "T10:00:00",
      end: new Date().toISOString().slice(0, 10) + "T10:30:00",
      backgroundColor: "#5a9",
    },
  ]);
  const [modalData, setModalData] = useState(null);

  const handleViewChange = (view) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.changeView(view);
  };

  const handleDateClick = (arg) => {
    setModalData({ start: arg.dateStr });
  };

  const handleEventClick = (arg) => {
    setModalData({
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr,
      backgroundColor: arg.event.backgroundColor,
    });
  };

  const handleEventDropResize = ({ event }) => {
    const updated = events.map((e) =>
      e.id === event.id ? { ...e, start: event.startStr, end: event.endStr } : e
    );
    setEvents(updated);
  };

  const handleSave = (newData) => {
    if (newData.id) {
      setEvents((prev) => prev.map((e) => (e.id === newData.id ? newData : e)));
    } else {
      setEvents((prev) => [...prev, { ...newData, id: Date.now().toString() }]);
    }
    setModalData(null);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalData(null);
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
        headerToolbar={false}
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
      />
      {modalData && (
        <EventModal
          data={modalData}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
