import React from "react";

// Komponen untuk menampilkan 1 task
class SchoolTask extends React.Component {
  render() {
    const { subject, task, isDone } = this.props;
    return (
      <div className={`task-card ${isDone ? "done" : ""}`}>
        <div className="task-info">
          <strong>{subject}</strong> - <span className={isDone ? "strike" : ""}>{task}</span>
        </div>
      </div>
    );
  }
}

// Komponen tombol Done / Not Yet
function Status({ taskId, isDone, onUpdate }) {
  const updateDone = (status) => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzT4E03CfKNhShpsTzKwiB3XtmGkgLzNWHE1SxHrJH1vXR0hlZMJQiHMDMagC7okm4k/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `method=update&Id=${taskId}&Done=${status}`,
      }
    )
      .then((res) => res.text())
      .then(() => onUpdate(taskId, status))
      .catch((err) => console.log(err));
  };

  return (
    <div className="status-buttons">
      <button className="btn done-btn" onClick={() => updateDone(true)}>
        Done
      </button>
      <button className="btn notyet-btn" onClick={() => updateDone(false)}>
        Not Yet
      </button>
    </div>
  );
}

// Form untuk menambah task baru
function FormToSheet({ onAdd }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const url =
      "https://script.google.com/macros/s/AKfycbzT4E03CfKNhShpsTzKwiB3XtmGkgLzNWHE1SxHrJH1vXR0hlZMJQiHMDMagC7okm4k/exec";

    const subject = e.target.subject.value.trim();
    const task = e.target.task.value.trim();
    if (!subject || !task) return;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `Subject=${subject}&Task=${task}`,
    })
      .then((res) => res.text())
      .then(() => {
        onAdd();
        e.target.reset();
      })
      .catch((error) => console.log(error));
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input name="subject" placeholder="Subject" required />
      <input name="task" placeholder="Task" required />
      <button className="btn add-btn" type="submit">
        Add Task
      </button>
    </form>
  );
}

// Komponen utama
function App() {
  const [tasks, setTasks] = React.useState([]);

  const fetchData = () => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzT4E03CfKNhShpsTzKwiB3XtmGkgLzNWHE1SxHrJH1vXR0hlZMJQiHMDMagC7okm4k/exec"
    )
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateDone = (id, status) => {
    setTasks((prev) =>
      prev.map((item) => (item.Id === id ? { ...item, Done: status } : item))
    );
  };

  return (
    <div className="app-container">
      <h1>List Tugas</h1>
      <FormToSheet onAdd={fetchData} />
      {tasks.map((item) => (
        <div className="task-wrapper" key={item.Id}>
          <SchoolTask subject={item.Subject} task={item.Task} isDone={item.Done} />
          <Status taskId={item.Id} isDone={item.Done} onUpdate={handleUpdateDone} />
        </div>
      ))}
    </div>
  );
}

export default App;
