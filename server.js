import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// 🔗 Koneksi ke MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // ubah jika username MySQL kamu berbeda
  password: "",       // isi password jika ada
  database: "tasks_db" // pastikan database ini sudah dibuat
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal connect MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Terhubung ke MySQL!");
});

// 📌 Endpoint: Ambil semua tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 📌 Endpoint: Tambah task baru
app.post("/tasks", (req, res) => {
  const { subject, task } = req.body;
  db.query(
    "INSERT INTO tasks (subject, task, done) VALUES (?, ?, ?)",
    [subject, task, false],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Task berhasil ditambahkan");
    }
  );
});

// 📌 Endpoint: Hapus task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send("Task dihapus");
  });
});


// 📌 Endpoint: Update status task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  db.query(
    "UPDATE tasks SET done = ? WHERE id = ?",
    [done, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Task berhasil diupdate");
    }
  );
});

// 🚀 Jalankan server
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
