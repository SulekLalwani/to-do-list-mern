import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState(["Empty"]);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
      });
  }, []);

  function addTask(event) {
    event.preventDefault();
    const newTaskInput = event.target.elements.newTask;
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ newTask: newTaskInput.value }),
    }).then((res) => {
      if (res.status === 202) {
        setTasks([...tasks, newTaskInput.value]);
        newTaskInput.value = "";
      }
    });
  }

  console.log("Render Component");

  return (
    <div className="App">
      <ul>
        {tasks.map((task) => (
          <li>{task}</li>
        ))}
      </ul>
      <form onSubmit={addTask}>
        <input name="newTask"></input>
      </form>
    </div>
  );
}

export default App;
