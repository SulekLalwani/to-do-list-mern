import TaskList from "./TaskList";
import Login from "./Login";
import Signup from "./Signup";
import { Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import "./App.css";

export const LoggedInContext = createContext(null);

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    if (JSON.parse(localStorage.getItem("loggedIn"))) {
      return JSON.parse(localStorage.getItem("loggedIn"));
    } else {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
  }, [loggedIn]);

  return (
    <div className="App">
      <LoggedInContext.Provider value={[loggedIn, setLoggedIn]}>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
