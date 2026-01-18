import { useEffect, useState } from "react";
import AddConnection from "../AddConnection/AddConnection";
import classes from './CalendarView.module.css'
import Calendar, { type EventDetails } from "../Calendar/Calendar";

interface UserPayload {
  user_id: string;
  username: string;
  rows: Array<EventDetails>;
}

export default function CalendarView() {
  const FETCH_EVENTS_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/fetch-events";
  const JWT_TOKEN = localStorage.getItem("authToken");

  const [calendarPayload, setCalendarPayload] = useState<Array<UserPayload>>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let startTimestamp = new Date();
        startTimestamp.setHours(0, 0, 0, 0);
        let endTimestamp = new Date(startTimestamp);
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
        }))

        console.log("fetch results: ", convertedResults);
        setCalendarPayload(convertedResults);
      } catch (err) {
        alert("Something went wrong when fetching the events!");
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={classes.calendarView}>
      {calendarPayload?.map(payload => (
        <Calendar
          key={payload.user_id}
          events={payload.rows}
          user_id={payload.user_id}
          username={payload.username}
          readonly={payload.user_id !== calendarPayload[0].user_id}
        />
      ))}
      <AddConnection />
    </div>
  )
}
