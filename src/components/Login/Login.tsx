import { useState } from "react";

export default function Login({onLogin}) {
	const LOGIN_ENDPOINT = "https://ng9l7u3ui2.execute-api.ca-central-1.amazonaws.com/login"

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const submit = async (e) => {
		console.log("GOT IN HERE!")
		e.preventDefault();

		const res = await fetch(LOGIN_ENDPOINT, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({username, password})
		});

		if (!res.ok) {
			alert("Login failed!");
			return;
		}

		const {token} = await res.json();
		localStorage.setItem("authToken", token);
		onLogin(token);
	};

	return (
	<form onSubmit={submit}>
			<input value={username} onChange={e => setUsername(e.target.value)} />
			<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
			<button type="submit">Login</button>
	</form>
	)
}
