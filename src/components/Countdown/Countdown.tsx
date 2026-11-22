import { useEffect, useState } from 'react'
import classes from './Countdown.module.css'

export default function Countdown() {
    const targetTime = new Date(2027, 0, 4).getTime()
    const title = 'Time until Mexico'
    const [remainingSeconds, setRemainingSeconds] = useState(() =>
        Math.max(0, Math.floor((targetTime - Date.now()) / 1000)),
    )

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setRemainingSeconds(Math.max(0, Math.floor((targetTime - Date.now()) / 1000)))
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [targetTime])

    const days = Math.floor(remainingSeconds / 86400)
    const hours = Math.floor((remainingSeconds % 86400) / 3600)
    const minutes = Math.floor((remainingSeconds % 3600) / 60)
    const seconds = remainingSeconds % 60
    const time = [hours, minutes, seconds]
        .map((part) => String(part).padStart(2, '0'))
        .join(':')

    return (
        <div className={classes.parent}>
            <div className={classes.inner}>
                <h1 aria-label={`${title} 🏖️🥳`}>
                    <span aria-hidden="true">
                        {Array.from(title).map((letter, index) => (
                            <span
                                className={classes.waveLetter}
                                style={{ animationDelay: `${index * 80}ms` }}
                                key={index}
                            >
                                {letter === ' ' ? '\u00a0' : letter}
                            </span>
                        ))}
                        {' 🏖️🥳'}
                    </span>
                </h1>
                <h2>{days} days</h2>
                <h3>{time}</h3>
            </div>
        </div>
    )
}