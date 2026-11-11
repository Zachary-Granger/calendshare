import { useState } from 'react';
import classes from './EventConfirmationDialogue.module.css'

interface ConfirmationProps {
  confirmationDetails: ConfirmationDetails;
  confirmationCallback: Function;
  cancellationCallback: Function;
  timeChangeCallback: (startTimestamp: Date, endTimestamp: Date) => void;
}

interface ConfirmationDetails {
  startTimestamp?: Date;
  endTimestamp?: Date;
}

export default function EventConfirmationDialogue({ confirmationDetails, confirmationCallback, cancellationCallback, timeChangeCallback }: ConfirmationProps) {
  const CREATE_EVENT_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/events"
  const JWT_TOKEN = localStorage.getItem("authToken");
  const THIRTY_MINUTES = 30 * 60 * 1000;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTimestamp, setStartTimestamp] = useState<Date | undefined>(confirmationDetails.startTimestamp);
  const [endTimestamp, setEndTimestamp] = useState<Date | undefined>(confirmationDetails.endTimestamp);

  const getMinimumTimestamp = (date: Date) => {
    const minimumTimestamp = new Date(date.getTime());
    minimumTimestamp.setHours(6, 0, 0, 0);
    return minimumTimestamp;
  }

  const getMaximumTimestamp = (date: Date) => {
    const maximumTimestamp = new Date(date.getTime());
    maximumTimestamp.setHours(18, 0, 0, 0);
    return maximumTimestamp;
  }

  const isValidTimeRange = () => {
    if (!startTimestamp || !endTimestamp || startTimestamp.getTime() >= endTimestamp.getTime()) {
      return false;
    }

    return startTimestamp >= getMinimumTimestamp(startTimestamp) && endTimestamp <= getMaximumTimestamp(startTimestamp);
  }

  const adjustStartTimestamp = (offset: number) => {
    if (!startTimestamp || !endTimestamp) return;

    const updatedTimestamp = new Date(startTimestamp.getTime() + offset);
    if (
      updatedTimestamp >= getMinimumTimestamp(startTimestamp) &&
      updatedTimestamp < endTimestamp &&
      updatedTimestamp < getMaximumTimestamp(startTimestamp)
    ) {
      setStartTimestamp(updatedTimestamp);
      timeChangeCallback(updatedTimestamp, endTimestamp);
    }
  }

  const adjustEndTimestamp = (offset: number) => {
    if (!startTimestamp || !endTimestamp) return;

    const updatedTimestamp = new Date(endTimestamp.getTime() + offset);
    if (
      updatedTimestamp > startTimestamp &&
      updatedTimestamp > getMinimumTimestamp(startTimestamp) &&
      updatedTimestamp <= getMaximumTimestamp(startTimestamp)
    ) {
      setEndTimestamp(updatedTimestamp);
      timeChangeCallback(startTimestamp, updatedTimestamp);
    }
  }

  const canDecreaseStart = !!startTimestamp && !!endTimestamp &&
    startTimestamp.getTime() - THIRTY_MINUTES >= getMinimumTimestamp(startTimestamp).getTime();
  const canIncreaseStart = !!startTimestamp && !!endTimestamp &&
    startTimestamp.getTime() + THIRTY_MINUTES < endTimestamp.getTime() &&
    startTimestamp.getTime() + THIRTY_MINUTES < getMaximumTimestamp(startTimestamp).getTime();
  const canDecreaseEnd = !!startTimestamp && !!endTimestamp &&
    endTimestamp.getTime() - THIRTY_MINUTES > startTimestamp.getTime() &&
    endTimestamp.getTime() - THIRTY_MINUTES > getMinimumTimestamp(startTimestamp).getTime();
  const canIncreaseEnd = !!startTimestamp && !!endTimestamp &&
    endTimestamp.getTime() + THIRTY_MINUTES <= getMaximumTimestamp(startTimestamp).getTime();

  const submit = async () => {
    if (!isValidTimeRange() || !startTimestamp || !endTimestamp) return;

    const res = await fetch(CREATE_EVENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({
        startTimestamp: startTimestamp.toISOString(),
        endTimestamp: endTimestamp.toISOString(),
        title,
        description
      })
    });

    if (!res.ok) {
      alert("Something went wrong. Failed to create event!");
      return;
    } else {
      confirmationCallback();
    }
  }

  return (
    <dialog
      open
      className={classes.eventConfirmationDialogue}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey && !(event.target instanceof HTMLButtonElement)) {
          event.preventDefault();
          void submit();
        }
      }}
    >
      <h2>CONFIRM DETAILS</h2>
      <input value={title} placeholder='Title' onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      <textarea value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)} maxLength={255} />
      <div className={classes.timeRow}>
        <p>Start time: {startTimestamp?.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
        <button className={classes.timeBtn} disabled={!canDecreaseStart} onClick={() => adjustStartTimestamp(-THIRTY_MINUTES)}>-</button>
        <button className={classes.timeBtn} disabled={!canIncreaseStart} onClick={() => adjustStartTimestamp(THIRTY_MINUTES)}>+</button>
      </div>
      <div className={classes.timeRow}>
        <p>End time: {endTimestamp?.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</p>
        <button className={classes.timeBtn} disabled={!canDecreaseEnd} onClick={() => adjustEndTimestamp(-THIRTY_MINUTES)}>-</button>
        <button className={classes.timeBtn} disabled={!canIncreaseEnd} onClick={() => adjustEndTimestamp(THIRTY_MINUTES)}>+</button>
      </div>
      <div>
        <button onClick={submit} disabled={!isValidTimeRange()}>confirm</button>
        <button className={classes.cancelBtn} onClick={() => cancellationCallback()}>cancel</button>
      </div>
    </dialog>
  )
}
