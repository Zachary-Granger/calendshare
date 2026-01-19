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
  startTimestamp?: Date;
  endTimestamp?: Date;
}

export default function EventEditDialogue({ editDetails, confirmationCallback, cancellationCallback, deleteCallback }: EditProps) {
  const EDIT_EVENT_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/events"
  const JWT_TOKEN = localStorage.getItem("authToken");

  const [title, setTitle] = useState<string>(editDetails.title);
  const [description, setDescription] = useState<string>(editDetails.description || "");

  const editEvent = async () => {
		const startTimestamp = editDetails.startTimestamp?.toISOString();
		const endTimestamp = editDetails.endTimestamp?.toISOString();

    const res = await fetch(EDIT_EVENT_ENDPOINT, {
      method: "PATCH",
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
      alert("Something went wrong. Failed to create event!");
      return;
    } else {
			deleteCallback();
		}
  }

  return (
    <dialog open className={classes.eventEditDialogue}>
      <h2>EDIT DETAILS</h2>
      <input value={title} placeholder='Title' onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      <input value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)} maxLength={255} />
      <p>Start time: {editDetails.startTimestamp?.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
      <p>End time: {editDetails.endTimestamp?.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
      <div>
        <button onClick={editEvent}>save</button>
        <button onClick={() => cancellationCallback()}>cancel</button>
        <button onClick={deleteEvent}>DELETE EVENT</button>
      </div>
    </dialog>
  )
}
