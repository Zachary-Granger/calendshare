import classes from './PlaceholderEventTile.module.css'

interface PlaceholderEventTileProperties {
  topPosition: number;
  bottomPosition: number;
  leftPosition: number;
  rightPosition: number;
}

export default function PlaceholderEventTile(props: PlaceholderEventTileProperties) {
  return (
    <div 
			className={classes.placeholderEventTile} 
			style={{ top: props.topPosition, height: props.bottomPosition - props.topPosition, 
				left: props.leftPosition, width: props.rightPosition - props.leftPosition }}>
    </div>
    // <button className={classes.eventTile}>EVENT BUTTON!</button>
  )
}
