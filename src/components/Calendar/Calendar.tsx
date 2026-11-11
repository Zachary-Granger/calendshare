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
  element: HTMLTableCellElement;
}

interface CalendarProps {
  events: Array<EventDetails>;
  user_id: string;
  username: string;
  readonly: boolean;
}

export default function Calendar(props: CalendarProps) {
  const DELETE_CONNECTION_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/connections"
  const JWT_TOKEN = localStorage.getItem("authToken");

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

  const getCellTopPosition = (timestamp: Date) => {
    const cells = cellRefs.current;
    if (cells.length < 2) return undefined;

    const timestampValue = timestamp.getTime();
    const exactCell = cells.find(cell => cell.timestamp.getTime() === timestampValue);
    if (exactCell) return exactCell.element.getBoundingClientRect().top;

    const nextCellIndex = cells.findIndex(cell => cell.timestamp.getTime() > timestampValue);
    const beforeCell = nextCellIndex <= 0
      ? cells[0]
      : nextCellIndex === -1
        ? cells[cells.length - 2]
        : cells[nextCellIndex - 1];
    const afterCell = nextCellIndex <= 0
      ? cells[1]
      : nextCellIndex === -1
        ? cells[cells.length - 1]
        : cells[nextCellIndex];

    const beforeRect = beforeCell.element.getBoundingClientRect();
    const afterRect = afterCell.element.getBoundingClientRect();
    const timeRatio = (timestampValue - beforeCell.timestamp.getTime()) /
      (afterCell.timestamp.getTime() - beforeCell.timestamp.getTime());

    return beforeRect.top + (afterRect.top - beforeRect.top) * timeRatio;
  };

  const getPreviewBounds = (startTimestamp: Date, endTimestamp: Date) => {
    const top = getCellTopPosition(startTimestamp);
    const bottom = getCellTopPosition(endTimestamp);
    const firstCell = cellRefs.current[0];
    if (top === undefined || bottom === undefined || !firstCell) return undefined;

    const rect = firstCell.element.getBoundingClientRect();
    return { top, bottom, left: rect.left, right: rect.right };
  };

  const updateSelectionPreview = (startTimestamp: Date, endTimestamp: Date) => {
    const bounds = getPreviewBounds(startTimestamp, endTimestamp);
    if (!bounds) return;

    setSelectTopPosition(bounds.top);
    setSelectBottomPosition(bounds.bottom);
    setSelectLeftPosition(bounds.left);
    setSelectRightPosition(bounds.right);
  };

  const updateEventPreview = (eventId: string, startTimestamp: Date, endTimestamp: Date) => {
    const bounds = getPreviewBounds(startTimestamp, endTimestamp);
    if (!bounds) return;

    setEvents(currentEvents => currentEvents.map(event => event.id === eventId
      ? {
          ...event,
          top_position: bounds.top,
          bottom_position: bounds.bottom,
          left_position: bounds.left,
          right_position: bounds.right
        }
      : event
    ));
  };

  const timeTable: Date[] = [];
  const timestamp = new Date();
  timestamp.setHours(6, 0, 0, 0);
  for (let i = 6.0; i <= 18.0; i += 0.5) {
    timeTable.push(new Date(timestamp.getTime()));
    timestamp.setMinutes(timestamp.getMinutes() + 30);
  }

  useLayoutEffect(() => {
    const positionEvents = () => {
      if (cellRefs.current.length === 0) return;

      setEvents(currentEvents => currentEvents.map(event => {
        const startCell = cellRefs.current.find(
          cell => cell.timestamp.getTime() === event.start_timestamp.getTime()
        );
        const endCell = cellRefs.current.find(
          cell => cell.timestamp.getTime() === event.end_timestamp.getTime()
        );
        const startRect = startCell?.element.getBoundingClientRect();
        const endRect = endCell?.element.getBoundingClientRect();

        return {
          ...event,
          top_position: startRect?.top ?? event.top_position,
          bottom_position: endRect?.top ?? event.bottom_position,
          left_position: startRect?.left ?? event.left_position,
          right_position: startRect?.right ?? event.right_position
        };
      }));
    };

    positionEvents();
    window.addEventListener("resize", positionEvents);
    return () => window.removeEventListener("resize", positionEvents);
  }, []);

	const deleteConnection = async () => {
    const res = await fetch(DELETE_CONNECTION_ENDPOINT, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({ share_id: props.user_id})
    });

    if (!res.ok) {
      alert("Something went wrong. Failed to create event!");
      return;
    } else {
			window.location.reload();
    }
	}

  const beginSelectRange = (tableRowId: number, tableCell: HTMLTableCellElement) => {
    if (!props.readonly && !confirmingEvent) {
      setSelectStart(tableRowId);
      setSelectEnd(tableRowId);

      // calculate the top and bottom positions of the cell to pass to the Event Tile
      setSelectTopPosition(tableCell.getBoundingClientRect().top);
      setSelectBottomPosition(tableCell.getBoundingClientRect().top);
      setSelectLeftPosition(tableCell.getBoundingClientRect().left);
      setSelectRightPosition(tableCell.getBoundingClientRect().right);
    }
  }

  const continueSelectRange = (tableRowId: number, tableCell: HTMLTableCellElement) => {
    if (!props.readonly && !confirmingEvent) {
      setSelectEnd(tableRowId);
      // calculate the bottom position to expand the selection
      setSelectBottomPosition(tableCell.getBoundingClientRect().top);
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
    closeDialogue();
    // to reset the data, I don't currently have a better way than refreshing the whole page
    window.location.reload();
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
    <div>
    	{
			//worth noting that the onMouseUp event only triggers when the mouse is in the table.
      // Probably need to move this up to the app level or find another way to make it global
			}
      <div id="calendar" className={classes.parent}>
        <table onMouseUp={() => endSelectRange()}>
          <thead>
            <tr>
              <th className={classes.unselectable}></th>
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
                  ref={(el) => { if (el) cellRefs.current[index] = { timestamp: entry, element: el }; }}
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
          <EventConfirmationDialogue
            confirmationDetails={confirmationDetails}
            confirmationCallback={confirmDialogue}
            cancellationCallback={closeDialogue}
            timeChangeCallback={updateSelectionPreview}
          />
        )}

        {events.map((event) => (
          <EventTile
            key={event.id}
            event_id={event.id}
            title={event.title}
            description={event.description}
            start_timestamp={event.start_timestamp}
            end_timestamp={event.end_timestamp}
            topPosition={event.top_position}
            bottomPosition={event.bottom_position}
            leftPosition={event.left_position}
            rightPosition={event.right_position}
            readonly={props.readonly}
            timeChangeCallback={(startTimestamp, endTimestamp) => updateEventPreview(event.id, startTimestamp, endTimestamp)}
          />
        ))}

      </div>
      {props.readonly && <button onClick={deleteConnection}>X</button>}
    </div>
  )
}
