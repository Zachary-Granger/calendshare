import { useState } from "react";
import classes from './Login.module.css'

interface LoginProps {
  onLogin: Function;
}

export default function Login({ onLogin }: LoginProps) {
  const LOGIN_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/login"
  const REGISTRATION_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/users"

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Login failed!");
      return;
    }

    const { token } = await res.json();
    localStorage.setItem("authToken", token);
    onLogin(token);
  };

  const register = async () => {
    const res = await fetch(REGISTRATION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Registration failed!");
      return;
    }

    // now that the user is registered, perform the login action
    submit();
  }

  return (
    <div className={classes.loginContainer}>
      <div className={classes.row}>
        <input value={username} placeholder="username" onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' ? submit() : null} />
      </div>
      <div className={classes.row}>
        <input type="password" value={password} placeholder="password" onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' ? submit() : null} />
      </div>
      <div className={classes.row}>
        <button onClick={submit}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    </div>
  )
}
