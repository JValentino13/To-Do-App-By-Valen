/** @format */

import React from "react";

// Komponen untuk menampilkan 1 task
class SchoolTask extends React.Component {
  render() {
    const { subject, task, isDone } = this.props;
    return (
      <div className={`task-card ${isDone ? "done" : ""}`}>
        <div className='task-info'>
          <strong>{subject}</strong> -{" "}
          <span className={isDone ? "strike" : ""}>{task}</span>
        </div>
      </div>
    );
  }
}

// Komponen tombol Done / Not Yet
function Status({ taskId, isDone, onUpdate, onDelete }) {
  const updateDone = (status) => {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: status }),
    })
      .then((res) => res.text())
      .then(() => onUpdate(taskId, status))
      .catch((err) => console.log(err));
  };

  const deleteTask = () => {
    fetch(`http://localhost:5000/tasks/${taskId}`, { method: "DELETE" })
      .then((res) => res.text())
      .then(() => onDelete(taskId))
      .catch((err) => console.log(err));
  };

  return (
    <div className='status-buttons'>
      <button className='btn done-btn' onClick={() => updateDone(true)}>
        Done
      </button>
      <button className='btn notyet-btn' onClick={() => updateDone(false)}>
        Not Yet
      </button>
      <button className='btn delete-btn' onClick={deleteTask}>
        Delete
      </button>
    </div>
  );
}

// Form untuk menambah task baru
function FormToSheet({ onAdd }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = e.target.subject.value.trim();
    const task = e.target.task.value.trim();
    if (!subject || !task) return;

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, task }),
    })
      .then((res) => res.text())
      .then(() => {
        onAdd(); // refresh list
        e.target.reset();
      })
      .catch((error) => console.log(error));
  };

  return (
    <form className='task-form' onSubmit={handleSubmit}>
      <input name='subject' placeholder='Subject' required />
      <input name='task' placeholder='Task' required />
      <button className='btn add-btn' type='submit'>
        Add Task
      </button>
    </form>
  );
}

// Komponen utama
function App() {
  const [tasks, setTasks] = React.useState([]);
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  // Ambil data dari MySQL
  const fetchData = () => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateDone = (id, status) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: status } : item))
    );
  };

  return (
    <div className='app-container'>
      <h1>List Tugas</h1>
      <FormToSheet onAdd={fetchData} />
      {tasks.map((item) => (
        <div className='task-wrapper' key={item.id}>
          <SchoolTask
            subject={item.subject}
            task={item.task}
            isDone={item.done}
          />
          <Status
            taskId={item.id}
            isDone={item.done}
            onUpdate={handleUpdateDone}
            onDelete={handleDeleteTask}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
