import classes from '../EventEditDialogue/EventEditDialogue.module.css';

interface EventDetailsDialogueProps {
  title: string;
  description?: string;
  startTimestamp: Date;
  endTimestamp: Date;
  closeCallback: () => void;
}

export default function EventDetailsDialogue({
  title,
  description,
  startTimestamp,
  endTimestamp,
  closeCallback
}: EventDetailsDialogueProps) {
  return (
    <dialog open className={classes.eventEditDialogue}>
      <h2>EVENT DETAILS</h2>
      <input value={title} readOnly aria-label="Event title" />
      <textarea value={description || ""} readOnly aria-label="Event description" />
      <div className={classes.timeRow}>
        <p>Start time: {startTimestamp.toLocaleString()}</p>
      </div>
      <div className={classes.timeRow}>
        <p>End time: {endTimestamp.toLocaleString()}</p>
      </div>
      <div>
        <button onClick={closeCallback}>close</button>
      </div>
    </dialog>
  );
}
