import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CalendarView from './components/CalendarView/CalendarView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
			<CalendarView/>
    </>
  )
}

export default App
