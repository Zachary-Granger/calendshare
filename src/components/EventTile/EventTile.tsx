import { useState } from 'react';
import classes from './EventTile.module.css'
import EventEditDialogue from '../EventEditDialogue/EventEditDialogue';

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
}

export default function EventTile(props: EventTileProperties) {

  const [editing, setEditing] = useState(false);

  const confirmationCallback = () => {
    setEditing(false);
    // to reset the data, I don't currently have a better way than refreshing the whole page
    window.location.reload();
  }

	const handleOnClick = () => {
		if (!props.readonly) {
			setEditing(prev => !prev);
		}
	}

  const deleteCallback = () => {
    setEditing(false);
    // to reset the data, I don't currently have a better way than refreshing the whole page
    window.location.reload();
  }

  return (
    <>
      <div onClick={handleOnClick}
        className={classes.eventTile}
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
          cancellationCallback={() => { setEditing(false) }}
          deleteCallback={deleteCallback}
        />
      }
    </>
  )
}
