import { useEffect, useState } from "react";
import "./TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [edit, setEdit] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState([]);
  const [invalidInput, setInvalidInput] = useState(false);

  useEffect(async () => {
    const response = await fetch("http://localhost:5000/", {
      credentials: "include",
    });
    const data = await response.json();
    setTasks(data.tasks);
  }, []);

  useEffect(() => {
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    setEditingTask(newEditingTask);
  }, [tasks]);

  useEffect(() => {
    if (editingTask.some((value) => value === true)) {
      document.getElementsByName("editTask")[editingTask.indexOf(true)].focus();
    }
  }, [editingTask]);

  useEffect(() => {
    document.getElementsByName("newTask")[0].focus();
  }, [addingTask]);

  function addTask() {
    setAddingTask(true);
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    setEditingTask(newEditingTask);
    setInvalidInput(false);
  }

  async function acceptAddition(event) {
    event.preventDefault();
    const newTaskInput = event.target.elements.newTask;

    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ newTask: newTaskInput.value }),
      credentials: "include",
    });

    if (response.status === 201) {
      setTasks([...tasks, newTaskInput.value]);
      newTaskInput.value = "";
      setAddingTask(false);
      setInvalidInput(false);
    } else {
      setInvalidInput(true);
    }
  }

  async function deleteTask(index) {
    const response = await fetch("http://localhost:5000", {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ taskToDelete: index }),
      credentials: "include",
    });

    if (response.status === 200) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
      setAddingTask(false);
      setInvalidInput(false);
    }
  }

  function editTask(index) {
    const newEditingTask = [];
    tasks.map(() => newEditingTask.push(false));
    newEditingTask[index] = true;
    setEditingTask(newEditingTask);
    setAddingTask(false);
    setInvalidInput(false);
    setEdit(tasks[index]);
  }

  function cancelEdit(index) {
    const newEditingTask = [...editingTask];
    newEditingTask[index] = false;
    setEditingTask(newEditingTask);
    setInvalidInput(false);
  }

  async function acceptEdit(event, index) {
    event.preventDefault();

    const response = await fetch("http://localhost:5000", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ taskToEdit: index, edit: edit }),
      credentials: "include",
    });

    if (response.status === 200) {
      const newTasks = [...tasks];
      newTasks[index] = edit;
      setTasks(newTasks);
    } else {
      setInvalidInput(true);
    }
  }

  return (
    <div className="TaskList">
      <div>
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
                value={edit}
                onChange={(event) => {
                  setEdit(event.target.value);
                }}
                name="editTask"
                placeholder="Enter task"
                style={{ outline: invalidInput ? "1px red solid" : "none" }}
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
            <input
              name="newTask"
              placeholder="Enter task"
              style={{ outline: invalidInput ? "1px red solid" : "none" }}
            ></input>
            <div>
              <button className="acceptButton">
                <i></i>
              </button>{" "}
              <button
                className="cancelButton"
                type="button"
                onClick={() => {
                  setAddingTask(false);
                  setInvalidInput(false);
                }}
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

export default TaskList;
