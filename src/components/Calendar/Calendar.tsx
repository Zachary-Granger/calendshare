import { useState } from "react";
import classes from './Calendar.module.css'
import EventTile from "../EventTile/EventTile";

export default function Calendar() {
  const [selectStart, setSelectStart] = useState(-1);
  const [selectEnd, setSelectEnd] = useState(-1);
	const [selectTopPosition, setSelectTopPosition] = useState(0);
	const [selectBottomPosition, setSelectBottomPosition] = useState(0);
	const [selectLeftPosition, setSelectLeftPosition] = useState(0);
	const [selectRightPosition, setSelectRightPosition] = useState(0);


	const timeTable = [];
	for (let i = 6.0; i <= 18.0; i += 0.5) {
		const hours = i >= 13.0 ? Math.floor(i - 12.0) : Math.floor(i);
		const minutes = i % 1 != 0 ? ":30" : ":00";
		const amPm = i >= 12.0 ? " PM" : " AM";
		const timeDisplay = hours.toString().padStart(2, '0') + minutes + amPm;

		timeTable.push(timeDisplay);
	}

  const beginSelectRange = (tableRowId: number, tableCell: HTMLTableCellElement) => {
    setSelectStart(tableRowId);
    setSelectEnd(tableRowId);

		// calculate the top and bottom positions of the cell to pass to the Event Tile
		setSelectTopPosition(tableCell.getBoundingClientRect().top);
		setSelectBottomPosition(tableCell.getBoundingClientRect().bottom);
		setSelectLeftPosition(tableCell.getBoundingClientRect().left);
		setSelectRightPosition(tableCell.getBoundingClientRect().right);
  }

  const continueSelectRange = (tableRowId: number, tableCell: HTMLTableCellElement) => {
    if (selectStart > -1 && tableRowId >= selectStart) {
      setSelectEnd(tableRowId);
    }
		
		// calculate the bottom position to expand the selection
		setSelectBottomPosition(tableCell.getBoundingClientRect().bottom);
  }

  const endSelectRange = () => {
    //for now let's just clear the selection
    setSelectStart(-1);
    setSelectEnd(-1);

		// clear existing values for top and bottom positions
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
            <th className={classes.unselectable}>buttons</th>
          </tr>
        </thead>
        <tbody>
          {timeTable.map((entry, index) => (
            <tr key={index}>
              <td className={classes.unselectable}>{entry}</td>
              <td className={classes.tableCell} onMouseDown={(e) => beginSelectRange(index, e.currentTarget)} onMouseOver={(e) => continueSelectRange(index, e.currentTarget)} />
            </tr>
          ))}
        </tbody>
      </table>

			{selectStart > -1 && (
			 <EventTile topPosition={selectTopPosition} bottomPosition={selectBottomPosition} leftPosition={selectLeftPosition} rightPosition={selectRightPosition}/>
			)}

    </div>
  )
}
