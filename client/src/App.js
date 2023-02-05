import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [addingTask, setAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
      });
  }, []);

  useEffect(() => {
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    setEditingTask(newEditingTask);
  }, [tasks]);

  function addTask() {
    setAddingTask(true);
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    setEditingTask(newEditingTask);
  }

  function acceptAddition(event) {
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
        setAddingTask(false);
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
        setAddingTask(false);
      }
    });
  }

  function editTask(index) {
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    newEditingTask[index] = true;
    setEditingTask(newEditingTask);
    setAddingTask(false);
  }

  function cancelEdit(index) {
    const newEditingTask = [...editingTask];
    newEditingTask[index] = false;
    setEditingTask(newEditingTask);
  }

  function acceptEdit(event, index) {
    event.preventDefault();
    const editedTaskInput = event.target.elements.editTask;
    fetch("http://localhost:5000", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ taskToEdit: index, edit: editedTaskInput.value }),
    }).then((res) => {
      if (res.status === 200) {
        const newTasks = [...tasks];
        newTasks[index] = editedTaskInput.value;
        setTasks(newTasks);
      }
    });
  }

  return (
    <div className="App">
      <div className="taskList">
        {tasks.map((task, index) => (
          <div className="task">
            <div style={{ display: editingTask[index] ? "none" : "flex" }}>
              <p>{task}</p>
              <div>
                <button className="editButton" onClick={() => editTask(index)}>
                  <i></i>
                </button>{" "}
                <button
                  className="deleteButton"
                  onClick={() => deleteTask(index)}
                >
                  <i></i>
                </button>
              </div>
            </div>
            <form
              onSubmit={(event) => {
                acceptEdit(event, index);
              }}
              style={{ display: !editingTask[index] ? "none" : "flex" }}
            >
              <input
                defaultValue={task}
                name="editTask"
                placeholder="Enter task"
              ></input>{" "}
              <div>
                <button className="acceptButton">
                  <i></i>
                </button>{" "}
                <button
                  className="cancelButton"
                  type="button"
                  onClick={() => cancelEdit(index)}
                >
                  <i></i>
                </button>
              </div>
            </form>
          </div>
        ))}
        <div
          style={{ display: !addingTask ? "none" : "flex" }}
          className="task"
        >
          <form onSubmit={acceptAddition}>
            <input name="newTask" placeholder="Enter task"></input>
            <div>
              <button className="acceptButton">
                <i></i>
              </button>{" "}
              <button
                className="cancelButton"
                type="button"
                onClick={() => setAddingTask(false)}
              >
                <i></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <button onClick={addTask} className="addButton">
        <i></i>
      </button>
    </div>
  );
}

export default App;
