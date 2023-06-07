import React from "react";

import "./Login.css";

export default function Login() {
  async function logIn(event) {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });
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
          <button>Log in</button>
        </div>
      </form>
    </div>
  );
}
