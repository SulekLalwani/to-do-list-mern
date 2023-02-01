import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState("Empty");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
      });
  }, []);

  return (
    <div className="App">
      <p>{tasks}</p>
    </div>
  );
}

export default App;
