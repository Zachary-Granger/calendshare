import { useState } from 'react'
import './App.css'
import CalendarView from './components/CalendarView/CalendarView'
import Login from './components/Login/Login';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <>
      {authToken ? (
        <CalendarView />
      ) : (
        <Login onLogin={setAuthToken} />
      )}
    </>
  )
}

export default App
