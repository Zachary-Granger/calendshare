import { useState } from 'react';
import classes from './EventEditDialogue.module.css'

interface EditProps {
  editDetails: EditDetails;
  confirmationCallback: Function;
  cancellationCallback: Function;
  deleteCallback: Function;
}

interface EditDetails {
  event_id: string;
  title: string;
  description?: string;
  startTimestamp: Date;
  endTimestamp: Date;
}

export default function EventEditDialogue({ editDetails, confirmationCallback, cancellationCallback, deleteCallback }: EditProps) {
  const EDIT_EVENT_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/events"
  const JWT_TOKEN = localStorage.getItem("authToken");
  const THIRTY_MINUTES = 30 * 60 * 1000;

  const [title, setTitle] = useState<string>(editDetails.title);
  const [description, setDescription] = useState<string>(editDetails.description || "");
  const [startTimestamp, setStartTimestamp] = useState<Date>(editDetails.startTimestamp);
  const [endTimestamp, setEndTimestamp] = useState<Date>(editDetails.endTimestamp);

  const editEvent = async () => {
    const startTimestampISO = startTimestamp.toISOString();
    const endTimestampISO = endTimestamp.toISOString();

    const res = await fetch(EDIT_EVENT_ENDPOINT, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({ event_id: editDetails.event_id, startTimestamp: startTimestampISO, endTimestamp: endTimestampISO, title, description })
    });

    if (!res.ok) {
      alert("Something went wrong. Failed to create event!");
      return;
    } else {
      confirmationCallback();
    }
  }

  const deleteEvent = async () => {
    console.log("event id to delete: ", editDetails.event_id);
    const res = await fetch(EDIT_EVENT_ENDPOINT, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({ event_id: editDetails.event_id })
    });

    if (!res.ok) {
      alert("Something went wrong. Failed to update the event!");
      return;
    } else {
      deleteCallback();
    }
  }

  const increaseStartTimestamp = () => {
    if (startTimestamp.getTime() + THIRTY_MINUTES < endTimestamp.getTime()) {
      let newStartDate: Date = new Date(startTimestamp.getTime());
      newStartDate.setTime(startTimestamp.getTime() + THIRTY_MINUTES);
      setStartTimestamp(newStartDate);
    }
  }

  const decreaseStartTimestamp = () => {
    //TODO: protect against going earlier than 6am
    let newStartDate: Date = new Date(startTimestamp.getTime());
    newStartDate.setTime(startTimestamp.getTime() - THIRTY_MINUTES);
    setStartTimestamp(newStartDate);
  }

  const increaseEndTimestamp = () => {
    //TODO: protext against going later than 6pm
    let newEndDate: Date = new Date(endTimestamp.getTime());
    newEndDate.setTime(endTimestamp.getTime() + THIRTY_MINUTES);
    setEndTimestamp(newEndDate);
  }

  const decreaseEndTimestamp = () => {
    if (endTimestamp.getTime() - THIRTY_MINUTES > startTimestamp.getTime()) {
      let newEndDate: Date = new Date(endTimestamp.getTime());
      newEndDate.setTime(endTimestamp.getTime() - THIRTY_MINUTES);
      setEndTimestamp(newEndDate);
    }
  }

  return (
    <dialog open className={classes.eventEditDialogue}>
      <h2>EDIT DETAILS</h2>
      <input value={title} placeholder='Title' onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      <textarea value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)} maxLength={255} />
      <div className={classes.timeRow}>
        <p>Start time: {startTimestamp.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
        <button className={classes.timeBtn} onClick={decreaseStartTimestamp}>-</button>
				<button className={classes.timeBtn} onClick={increaseStartTimestamp}>+</button>
      </div>
      <div className={classes.timeRow}>
        <p>End time: {endTimestamp.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
        <button className={classes.timeBtn} onClick={decreaseEndTimestamp}>-</button>
				<button className={classes.timeBtn} onClick={increaseEndTimestamp}>+</button>
      </div>
      <div>
        <button onClick={editEvent}>save</button>
        <button className={classes.cancelBtn} onClick={() => cancellationCallback()}>cancel</button>
        <button className={classes.deleteBtn} onClick={deleteEvent}>DELETE EVENT</button>
      </div>
    </dialog>
  )
}
