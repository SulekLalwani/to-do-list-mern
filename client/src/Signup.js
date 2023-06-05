import React from "react";

import "./Signup.css";

export default function Signup() {
  async function signUp(event) {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const repeatedPassword = event.target.elements.repeatedPassword.value;

    await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        repeatedPassword: repeatedPassword,
      }),
    });
  }

  return (
    <div className="Signup">
      <form className="SignupForm" onSubmit={signUp}>
        <h1>Sign up</h1>
        <div>
          <div>
            <input placeholder="Username" required="true" name="username" />
            <input
              type="password"
              placeholder="Password"
              required="true"
              name="password"
            />
            <input
              type="password"
              placeholder="Repeat password"
              required="true"
              name="repeatedPassword"
            />
          </div>
          <button>Sign up</button>
        </div>
      </form>
    </div>
  );
}
