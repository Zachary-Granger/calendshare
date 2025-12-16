import { useState } from "react";

export default function Calendar() {
  const [selectStart, setSelectStart] = useState(-1);
	const [selectEnd, setSelectEnd] = useState(-1);

  const timeTable = [
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 AM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
  ];

  const beginSelectRange = (tableRowId: number) => {
    console.log('Table Row ID: ', tableRowId);
    setSelectStart(tableRowId);
		setSelectEnd(tableRowId);
  }

	const continueSelectRange = (tableRowId: number) => {
		if (selectStart > -1 && tableRowId >= selectStart) {
			console.log("select range expanded to :", tableRowId);
			setSelectEnd(tableRowId);
		}
	}

	const endSelectRange = () => {
		//for now let's just clear the selection
		setSelectStart(-1);
		setSelectEnd(-1);
	}

  return (
		//worth noting that the onMouseUp event only triggers when the mouse is in the table. 
		// Probably need to move this up to the app level or find another way to make it global
    <table onMouseUp={() => endSelectRange()}>
      <thead>
        <tr>
          <th>time</th>
          <th>buttons</th>
        </tr>
      </thead>
      <tbody>
        {timeTable.map((entry, index) => (
          <tr key={index}>
            <td>{entry}</td>

            {
							!(index >= selectStart && index <= selectEnd) &&
              <td style={{ height:"20px" }} onMouseEnter={() => continueSelectRange(index)}><button onMouseDown={() => beginSelectRange(index)}>BUTTON HERE</button></td>
							||
							(index == selectStart &&
              <td style={{ height:"20px"}} rowSpan={selectEnd - selectStart + 1}><button style={{ width:"100%", height:"100%" }} onMouseDown={() => beginSelectRange(index)}>SECRET BUTTON</button></td>)
            }
          </tr>
        ))}
      </tbody>
    </table>
  )
}
