import { useLayoutEffect, useRef, useState } from "react";
import classes from './Calendar.module.css'
import EventTile from "../EventTile/EventTile";
import PlaceholderEventTile from "../PlaceholderEventTile/PlaceholderEventTile";
import EventConfirmationDialogue from "../EventConfirmationDialogue/EventConfirmationDialogue";

interface ConfirmationDetails {
  startTimestamp?: Date;
  endTimestamp?: Date;
}

export interface EventDetails {
  id: string;
  user_id: string;
  start_timestamp: Date;
  end_timestamp: Date;
  title: string;
  description?: string;
  top_position: number;
  bottom_position: number;
  left_position: number;
  right_position: number;
}

interface CellInfo {
  timestamp: Date;
  boundingRect: DOMRect;
}

interface CalendarProps {
  events: Array<EventDetails>;
  user_id: string;
  username: string;
  readonly: boolean;
}

export default function Calendar(props: CalendarProps) {
  const [selectStart, setSelectStart] = useState(-1);
  const [selectEnd, setSelectEnd] = useState(-1);
  const [selectTopPosition, setSelectTopPosition] = useState(0);
  const [selectBottomPosition, setSelectBottomPosition] = useState(0);
  const [selectLeftPosition, setSelectLeftPosition] = useState(0);
  const [selectRightPosition, setSelectRightPosition] = useState(0);

  const [confirmingEvent, setConfirmingEvent] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails>({})

  const [events, setEvents] = useState<Array<EventDetails>>(props.events);

  const cellRefs = useRef<CellInfo[]>([]);

  const timeTable: Date[] = [];
  const timestamp = new Date();
  timestamp.setHours(6, 0, 0, 0);
  for (let i = 6.0; i <= 18.0; i += 0.5) {
    timeTable.push(new Date(timestamp.getTime()));
    timestamp.setMinutes(timestamp.getMinutes() + 30);
  }

  useLayoutEffect(() => {
    if (events.length === 0 || cellRefs.current.length === 0) return;

    // Guard Clause
    // Check if any event currently has a 0 position.
    // If all events are already positioned, we stop here to prevent an infinite loop.
    const needPositioning = events.some(e => e.top_position === 0);
    if (!needPositioning) return;

    let updatedEvents = events;

    for (const cell of cellRefs.current) {
      for (const event of events) {
        if (cell.timestamp.getTime() === event.start_timestamp.getTime()) {
          updatedEvents = updatedEvents.map((item) => {
            if (item.id === event.id) {
              return {
                ...item,
                top_position: cell.boundingRect.top,
                left_position: cell.boundingRect.left,
                right_position: cell.boundingRect.right
              };
            }
            return item;
          });

        } else if (cell.timestamp.getTime() === event.end_timestamp.getTime()) {
          updatedEvents = updatedEvents.map((item) => {
            if (item.id === event.id) {
              return {
                ...item,
                bottom_position: cell.boundingRect.bottom
              };
            }
            return item;
          });

        }
      }
    }

    setEvents(updatedEvents);

  }, [events]);

  const beginSelectRange = (tableRowId: number, tableCell: HTMLTableCellElement) => {
    if (!props.readonly && !confirmingEvent) {
      setSelectStart(tableRowId);
      setSelectEnd(tableRowId);

      // calculate the top and bottom positions of the cell to pass to the Event Tile
      setSelectTopPosition(tableCell.getBoundingClientRect().top);
      setSelectBottomPosition(tableCell.getBoundingClientRect().bottom);
      setSelectLeftPosition(tableCell.getBoundingClientRect().left);
      setSelectRightPosition(tableCell.getBoundingClientRect().right);
    }
  }

  const continueSelectRange = (tableRowId: number, tableCell: HTMLTableCellElement) => {
    if (!props.readonly && !confirmingEvent) {
      setSelectEnd(tableRowId);
      // calculate the bottom position to expand the selection
      setSelectBottomPosition(tableCell.getBoundingClientRect().bottom);
    }
  }

  const endSelectRange = () => {
    if (!props.readonly) {
      setConfirmingEvent(true);
      setConfirmationDetails({
        startTimestamp: timeTable[selectStart],
        endTimestamp: timeTable[selectEnd]
      })
    }
  }

  const confirmDialogue = () => {
    alert("event saved!");
    closeDialogue();
  }

  const closeDialogue = () => {
    setConfirmingEvent(false);
    setConfirmationDetails({});
    setSelectStart(-1);
    setSelectEnd(-1);
    setSelectTopPosition(0);
    setSelectBottomPosition(0);
  }

  return (
    //worth noting that the onMouseUp event only triggers when the mouse is in the table. 
    // Probably need to move this up to the app level or find another way to make it global
    <div id="calendar" className={classes.parent}>
      <table onMouseUp={() => endSelectRange()}>
        <thead>
          <tr>
            <th className={classes.unselectable}>time</th>
            <th className={classes.unselectable}>{props.username}</th>
          </tr>
        </thead>
        <tbody>
          {timeTable.map((entry, index) => (
            <tr key={index}>
              <td className={classes.unselectable}>
                {entry.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}
              </td>
              <td className={classes.tableCell}
                ref={(el) => { if (el) cellRefs.current[index] = { timestamp: entry, boundingRect: el.getBoundingClientRect() }; }}
                onMouseDown={(e) => beginSelectRange(index, e.currentTarget)}
                onMouseOver={(e) => continueSelectRange(index, e.currentTarget)} />
            </tr>
          ))}
        </tbody>
      </table>

      {selectStart > -1 && (
        <PlaceholderEventTile topPosition={selectTopPosition} bottomPosition={selectBottomPosition} leftPosition={selectLeftPosition} rightPosition={selectRightPosition} />
      )}

      {confirmingEvent && (
        <EventConfirmationDialogue confirmationDetails={confirmationDetails} confirmationCallback={confirmDialogue} cancellationCallback={closeDialogue} />
      )}

      {events.map((event) => (
        <EventTile
          key={event.id}
          title={event.title}
          description={event.description}
          topPosition={event.top_position}
          bottomPosition={event.bottom_position}
          leftPosition={event.left_position}
          rightPosition={event.right_position}
        />
      ))}

    </div>
  )
}
