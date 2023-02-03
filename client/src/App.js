import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState(["Empty"]);
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

  function editTask(index) {
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    newEditingTask[index] = true;
    setEditingTask(newEditingTask);
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
    });

    const newTasks = [...tasks];
    newTasks[index] = editedTaskInput.value;
    setTasks(newTasks);
  }

  return (
    <div className="App">
      <ul>
        {tasks.map((task, index) => (
          <li>
            <div>
              <p hidden={editingTask[index]}>{task}</p>
              <button
                hidden={editingTask[index]}
                onClick={() => editTask(index)}
              >
                Edit
              </button>{" "}
              <button
                hidden={editingTask[index]}
                onClick={() => deleteTask(index)}
              >
                Delete
              </button>
            </div>
            <form
              onSubmit={(event) => {
                acceptEdit(event, index);
              }}
              hidden={!editingTask[index]}
            >
              <input defaultValue={task} name="editTask"></input>{" "}
              <button>Accept</button>{" "}
              <button type="button" onClick={() => cancelEdit(index)}>
                Cancel
              </button>
            </form>
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
