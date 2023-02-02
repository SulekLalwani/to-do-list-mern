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

  function deleteTask(index) {
    fetch("http://localhost:5000", {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ taskToDelete: index }),
    }).then((res) => {
      if (res.status === 200) {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
      }
    });
  }

  return (
    <div className="App">
      <ul>
        {tasks.map((task, index) => (
          <li>
            <p>{task}</p>{" "}
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addTask}>
        <input name="newTask"></input>
      </form>
    </div>
  );
}

export default App;
