import React from "react";

import "./Login.css";

export default function Login() {
  return (
    <div className="Login">
      <form className="LoginForm">
        <h1>Log in</h1>
        <div>
          <div>
            <input placeholder="Username" required="true" />
            <input type="password" placeholder="Password" required="true" />
          </div>
          <button>Log in</button>
        </div>
      </form>
    </div>
  );
}
