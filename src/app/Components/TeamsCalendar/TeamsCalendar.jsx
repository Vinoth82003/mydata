// TeamsCalendar.jsx
"use client";

import { useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./TeamsCalendar.module.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

const initialEvents = [
  {
    id: 0,
    title: "Design Review",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
  },
];

export default function TeamsCalendar() {
  const [events, setEvents] = useState(initialEvents);

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:");
    if (title) {
      const newEvent = {
        id: events.length + 1,
        title,
        start,
        end,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventResize = (data) => {
    const { event, start, end } = data;
    setEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
  };

  const handleEventDrop = (data) => {
    const { event, start, end } = data;
    setEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
  };

  return (
    <div className={styles.container}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.WEEK}
        style={{ height: "100vh" }}
        step={30}
        timeslots={2}
        selectable
        resizable
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onSelectSlot={handleSelectSlot}
        draggableAccessor={() => true}
      />
    </div>
  );
}
