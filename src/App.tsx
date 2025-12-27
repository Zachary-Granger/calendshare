import { useState } from 'react'
import './App.css'
import CalendarView from './components/CalendarView/CalendarView'
import Login from './components/Login/Login';
import Header from './components/Header/Header';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  return (
    <>
      {authToken ? (
        <>
          <Header />
          <CalendarView />
        </>
      ) : (
        <Login onLogin={setAuthToken} />
      )}
    </>
  )
}

export default App
