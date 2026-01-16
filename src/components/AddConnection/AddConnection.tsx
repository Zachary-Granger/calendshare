import { useState } from 'react'
import classes from './AddConnection.module.css'

export default function AddConnection() {
  const ADD_CONNECTION_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/connections";
  const JWT_TOKEN = localStorage.getItem("authToken");

  const [username, setUsername] = useState("");

  const changeUsername = (input: HTMLInputElement) => {
    setUsername(input.value);
  }

  const requestAddConnection = async () => {
    if (!username) {
      alert("Please Fill In the username!");
      return;
    }

    const res = await fetch(ADD_CONNECTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify({ username })
    });

		
    if (!res.ok) {
      alert("Something went wrong. Failed to add connection!");
      return;
    } else {
      alert("Connection successfully added!");
			setUsername("");
		}
  }

  return (
    <div className={classes.parent}>
      <div className={classes.inner}>
        <input placeholder="username" value={username} onChange={(e) => changeUsername(e.target)} />
        <button onClick={requestAddConnection}>Add Connection</button>
      </div>
    </div>
  )
}
