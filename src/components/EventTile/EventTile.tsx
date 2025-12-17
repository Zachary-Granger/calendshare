import classes from './EventTile.module.css'

interface EventTileProperties {
  topPosition: number;
  bottomPosition: number;
  leftPosition: number;
  rightPosition: number;
}

export default function EventTile(props: EventTileProperties) {
  return (
    <div 
			className={classes.eventTile} 
			style={{ top: props.topPosition, height: props.bottomPosition - props.topPosition, 
				left: props.leftPosition, width: props.rightPosition - props.leftPosition }}>
      This is a box on top
    </div>
    // <button className={classes.eventTile}>EVENT BUTTON!</button>
  )
}
