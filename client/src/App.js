import TaskList from "./TaskList";
import Login from "./Login";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
