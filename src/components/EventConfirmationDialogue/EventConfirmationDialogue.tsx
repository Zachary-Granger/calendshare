import { useState } from 'react';
import classes from './EventConfirmationDialogue.module.css'

interface ConfirmationProps {
  confirmationDetails: ConfirmationDetails;
  confirmationCallback: Function;
  cancellationCallback: Function;
}

interface ConfirmationDetails {
  startTimestamp?: Date;
  endTimestamp?: Date;
}

export default function EventConfirmationDialogue({ confirmationDetails, confirmationCallback, cancellationCallback }: ConfirmationProps) {
  const CREATE_EVENT_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/events"
  const JWT_TOKEN = localStorage.getItem("authToken");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const submit = async () => {
    const startTimestamp = confirmationDetails.startTimestamp?.toISOString();
    const endTimestamp = confirmationDetails.endTimestamp?.toISOString();

    const res = await fetch(CREATE_EVENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({ startTimestamp, endTimestamp, title, description })
    });

    if (!res.ok) {
      alert("Something went wrong. Failed to create event!");
      return;
    } else {
      confirmationCallback();
    }
  }

  return (
    <dialog open className={classes.eventConfirmationDialogue}>
      <h2>CONFIRM DETAILS</h2>
      <input value={title} placeholder='Title' onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      <textarea value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)} maxLength={255} />
      <div className={classes.timeRow}>
        <p>Start time: {confirmationDetails.startTimestamp?.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
      </div>
      <div className={classes.timeRow}>
        <p>End time: {confirmationDetails.endTimestamp?.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
      </div>
      <div>
        <button onClick={submit}>confirm</button>
        <button className={classes.cancelBtn} onClick={() => cancellationCallback()}>cancel</button>
      </div>
    </dialog>
  )
}
