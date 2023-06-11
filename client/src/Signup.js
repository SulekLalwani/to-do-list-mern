import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Signup.css";

export default function Signup() {
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  async function signUp(event) {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const repeatedPassword = event.target.elements.repeatedPassword.value;

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        repeatedPassword: repeatedPassword,
      }),
    });

    if (response.status === 201) {
      navigate("/login");
    } else if (response.status === 400) {
      const data = await response.json();
      setMessages(data);
    }
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
          <ul className="Messages">
            {messages.map((message) => (
              <li>{message}</li>
            ))}
          </ul>
          <button>Sign up</button>
        </div>
      </form>
      <Link to="/login">Log in</Link>
    </div>
  );
}
