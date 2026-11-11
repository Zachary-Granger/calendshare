import { useState } from 'react';
import classes from './EventTile.module.css'
import EventEditDialogue from '../EventEditDialogue/EventEditDialogue';
import EventDetailsDialogue from '../EventDetailsDialogue/EventDetailsDialogue';

interface EventTileProperties {
  event_id: string;
  title: string;
  description?: string;
  start_timestamp: Date;
  end_timestamp: Date;
  topPosition: number;
  bottomPosition: number;
  leftPosition: number;
  rightPosition: number;
  readonly: boolean;
  timeChangeCallback: (startTimestamp: Date, endTimestamp: Date) => void;
  refreshEvents: () => Promise<void>;
}

export default function EventTile(props: EventTileProperties) {

  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false);

  const confirmationCallback = () => {
    setEditing(false);
    void props.refreshEvents();
  }

	const handleOnClick = () => {
		if (props.readonly) {
      setViewing(true);
    } else {
			setEditing(prev => !prev);
		}
	}

  const deleteCallback = () => {
    setEditing(false);
    void props.refreshEvents();
  }

  return (
    <>
      <div onClick={handleOnClick}
        className={`${classes.eventTile} ${classes.entranceAnimation}`}
        style={{
          top: props.topPosition, height: props.bottomPosition - props.topPosition,
          left: props.leftPosition, width: props.rightPosition - props.leftPosition
        }}>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
      {editing &&
        <EventEditDialogue
          editDetails={{
            event_id: props.event_id,
            title: props.title,
            description: props.description,
            startTimestamp: props.start_timestamp,
            endTimestamp: props.end_timestamp
          }}
          confirmationCallback={confirmationCallback}
          cancellationCallback={() => {
            props.timeChangeCallback(props.start_timestamp, props.end_timestamp);
            setEditing(false);
          }}
          deleteCallback={deleteCallback}
          timeChangeCallback={props.timeChangeCallback}
        />
      }
      {viewing &&
        <EventDetailsDialogue
          title={props.title}
          description={props.description}
          startTimestamp={props.start_timestamp}
          endTimestamp={props.end_timestamp}
          closeCallback={() => setViewing(false)}
        />
      }
    </>
  )
}
