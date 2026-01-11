import classes from './EventTile.module.css'

interface EventTileProperties {
	title: string;
	description?: string;
  topPosition: number;
  bottomPosition: number;
  leftPosition: number;
  rightPosition: number;
}

export default function EventTile(props: EventTileProperties) {
	console.log("Event tile props: ", props);
  return (
    <div 
			className={classes.eventTile} 
			style={{ top: props.topPosition, height: props.bottomPosition - props.topPosition, 
				left: props.leftPosition, width: props.rightPosition - props.leftPosition }}>
			<h3>{props.title}</h3>
			<p>{props.description}</p>
    </div>
    // <button className={classes.eventTile}>EVENT BUTTON!</button>
  )
}
