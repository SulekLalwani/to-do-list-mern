import React, { useState } from "react";

import "./Login.css";

export default function Login() {
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  async function logIn(event) {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.status === 400) {
      setInvalidCredentials(true);
    }
  }

  return (
    <div className="Login">
      <form className="LoginForm" onSubmit={logIn}>
        <h1>Log in</h1>
        <div>
          <div>
            <input placeholder="Username" required="true" name="username" />
            <input
              type="password"
              placeholder="Password"
              required="true"
              name="password"
            />
          </div>
          <p className="Message" hidden={!invalidCredentials}>
            Username or password is incorrect
          </p>
          <button>Log in</button>
        </div>
      </form>
    </div>
  );
}
