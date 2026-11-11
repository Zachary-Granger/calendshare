import { useCallback, useEffect, useState } from "react";
import AddConnection from "../AddConnection/AddConnection";
import classes from './CalendarView.module.css'
import Calendar, { type EventDetails } from "../Calendar/Calendar";

const FETCH_EVENTS_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/fetch-events";

interface UserPayload {
  user_id: string;
  username: string;
  rows: Array<EventDetails>;
}

export default function CalendarView() {
  const JWT_TOKEN = localStorage.getItem("authToken");

  const [calendarPayload, setCalendarPayload] = useState<Array<UserPayload>>([]);

  const refreshEvents = useCallback(async () => {
    try {
      const startTimestamp = new Date();
      startTimestamp.setHours(0, 0, 0, 0);
      const endTimestamp = new Date(startTimestamp);
      endTimestamp.setDate(endTimestamp.getDate() + 1);

      const response = await fetch(FETCH_EVENTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JWT_TOKEN}`
        },
        body: JSON.stringify({ startTimestamp, endTimestamp })
      });

      if (!response.ok) {
        alert("Unable to fetch events!");
        return;
      }

      const result: Array<UserPayload> = await response.json();
      const convertedResults = result.map(userPayload => ({
        ...userPayload,
        rows: userPayload.rows.map(row => ({
          ...row,
          start_timestamp: new Date(row.start_timestamp),
          end_timestamp: new Date(row.end_timestamp),
          top_position: 0,
          bottom_position: 0,
          left_position: 0,
          right_position: 0
        }))
      }));

      setCalendarPayload(convertedResults);
    } catch {
      alert("Something went wrong when fetching the events!");
    }
  }, [JWT_TOKEN]);

  useEffect(() => {
    void refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    let intervalId: number | undefined;
    let isActive = document.visibilityState === "visible" && document.hasFocus();

    const stopPolling = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const startPolling = () => {
      if (intervalId !== undefined) return;

      intervalId = window.setInterval(() => {
        if (document.visibilityState === "visible" && document.hasFocus()) {
          void refreshEvents();
        } else {
          isActive = false;
          stopPolling();
        }
      }, 10_000);
    };

    const updateActivity = () => {
      const active = document.visibilityState === "visible" && document.hasFocus();
      if (active && !isActive) {
        void refreshEvents();
      }

      isActive = active;
      if (active) {
        startPolling();
      } else {
        stopPolling();
      }
    };

    const handleBlur = () => {
      isActive = false;
      stopPolling();
    };

    window.addEventListener("focus", updateActivity);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", updateActivity);

    if (isActive) startPolling();

    return () => {
      stopPolling();
      window.removeEventListener("focus", updateActivity);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, [refreshEvents]);

  return (
    <div className={classes.calendarView}>
      {calendarPayload?.map(payload => (
        <Calendar
          key={payload.user_id}
          events={payload.rows}
          user_id={payload.user_id}
          username={payload.username}
          readonly={payload.user_id !== calendarPayload[0].user_id}
          refreshEvents={refreshEvents}
        />
      ))}
      <AddConnection />
    </div>
  )
}
