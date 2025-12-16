import Calendar from "../Calendar/Calendar";
import classes from './CalendarView.module.css'

export default function CalendarView() {
  return (
    <div className={classes.calendarView}>
      <Calendar />
      <Calendar />
    </div>
  )
}
