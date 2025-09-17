import React from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Komponen task
class SchoolTask extends React.Component {
  render() {
    const { subject, task, isDone } = this.props;
    return (
      <div className={`task-card ${isDone ? "done" : ""}`}>
        <div className="task-info">
          <strong>{subject}</strong> -{" "}
          <span className={isDone ? "strike" : ""}>{task}</span>
        </div>
      </div>
    );
  }
}

// Tombol Done / Not Yet / Delete
function Status({ taskId, isDone, onUpdate, onDelete }) {
  const updateDone = async (status) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { done: status });
      onUpdate(taskId, status);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      onDelete(taskId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="status-buttons">
      <button className="btn done-btn" onClick={() => updateDone(true)}>
        Done
      </button>
      <button className="btn notyet-btn" onClick={() => updateDone(false)}>
        Not Yet
      </button>
      <button className="btn delete-btn" onClick={deleteTask}>
        Delete
      </button>
    </div>
  );
}

// Form tambah task
function Form({ onAdd }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const subject = e.target.subject.value.trim();
    const task = e.target.task.value.trim();
    if (!subject || !task) return;

    try {
      await addDoc(collection(db, "tasks"), {
        subject,
        task,
        done: false,
      });
      e.target.reset();
      onAdd(); // Refresh otomatis kalau perlu
    } catch (err) {
      console.error(err);
    }
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

  React.useEffect(() => {
    // Dengarkan perubahan realtime
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTasks(data);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateDone = (id, status) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: status } : item))
    );
  };

  return (
    <div className="app-container">
      <h1>List Tugas</h1>
      <Form onAdd={() => {}} /> {/* Tidak perlu refetch manual */}
      {tasks.map((item) => (
        <div className="task-wrapper" key={item.id}>
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
