import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoggedInContext } from "./App";
import "./Login.css";

export default function Login() {
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  async function logIn(event) {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
      credentials: "include",
    });

    if (response.status === 200) {
      setLoggedIn(true);
    } else if (response.status === 400) {
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
      <Link to="/signup">Sign up</Link>
    </div>
  );
}
