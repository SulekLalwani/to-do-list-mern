import React from "react";

import "./Login.css";

export default function Login() {
  return (
    <div className="Login">
      <form className="LoginForm">
        <h1>Sign in</h1>
        <div>
          <div>
            <input placeholder="Username" />
            <input type="password" placeholder="Password" />
          </div>
          <button>Sign in</button>
        </div>
      </form>
    </div>
  );
}
