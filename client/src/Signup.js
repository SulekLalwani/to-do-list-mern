import React from "react";

import "./Signup.css";

export default function Signup() {
  return (
    <div className="Signup">
      <form className="SignupForm">
        <h1>Sign up</h1>
        <div>
          <div>
            <input placeholder="Username" required="true" />
            <input type="password" placeholder="Password" required="true" />
            <input
              type="password"
              placeholder="Repeat password"
              required="true"
            />
          </div>
          <button>Sign up</button>
        </div>
      </form>
    </div>
  );
}
