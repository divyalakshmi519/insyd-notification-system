
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./insyd_full.db", (err) => {
  if (err) console.error("❌ DB Error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    followerId INTEGER,
    followingId INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    postId INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    message TEXT,
    isRead INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log("✅ All tables are ready");
});

// --- Users routes ---
// Create user
app.post("/api/users", (req, res) => {
  const { username, email } = req.body;
  db.run("INSERT INTO users (username, email) VALUES (?, ?)", [username, email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, username, email });
  });
});

// Get ALL users (with counts)
app.get("/api/users", (req, res) => {
  db.all(
    `SELECT u.*,
      (SELECT COUNT(*) FROM followers WHERE followingId = u.id) as followers,
      (SELECT COUNT(*) FROM followers WHERE followerId = u.id) as following
    FROM users u`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get single user (with counts)
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.get(
    `SELECT u.*,
      (SELECT COUNT(*) FROM followers WHERE followingId = u.id) as followers,
      (SELECT COUNT(*) FROM followers WHERE followerId = u.id) as following
    FROM users u WHERE u.id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// --- Posts routes ---
app.get("/api/posts", (req, res) => {
  db.all(`SELECT posts.*, users.username 
          FROM posts LEFT JOIN users ON posts.userId = users.id 
          ORDER BY posts.createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/posts", (req, res) => {
  const { userId, content } = req.body;
  db.run("INSERT INTO posts (userId, content) VALUES (?, ?)", [userId, content], function(err) {
    if(err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, userId, content });
  });
});

// --- Likes and Notifications ---
app.post("/api/likes", (req, res) => {
  const { userId, postId, type } = req.body;
  db.run("INSERT INTO likes (userId, postId) VALUES (?, ?)", [userId, postId], function(err) {
    if(err) return res.status(500).json({ error: err.message });
    db.get("SELECT userId FROM posts WHERE id = ?", [postId], (err2, post) => {
      if(err2) return res.status(500).json({ error: err2.message });
      if(post && post.userId !== userId){
        const message = type === "dislike" ? "Disliked your post" : "Liked your post";
        db.run("INSERT INTO notifications (userId, message) VALUES (?, ?)", [post.userId, message]);
      }
      res.json({ success: true });
    });
  });
});

// --- Followers routes ---
app.post("/api/followers", (req, res) => {
  const { followerId, followingId } = req.body;
  db.get("SELECT * FROM followers WHERE followerId=? AND followingId=?", [followerId, followingId], (err,row)=>{
    if(err) return res.status(500).json({ error: err.message });
    if(row){
      db.run("DELETE FROM followers WHERE id=?", [row.id], (err2)=>{
        if(err2) return res.status(500).json({ error: err2.message });
        res.json({ success:true });
      });
    } else {
      db.run("INSERT INTO followers (followerId, followingId) VALUES (?, ?)", [followerId, followingId], function(err3){
        if(err3) return res.status(500).json({ error: err3.message });
        db.run("INSERT INTO notifications (userId, message) VALUES (?, ?)", [followingId, "New follower!"]);
        res.json({ success: true });
      });
    }
  });
});

// Get followers of a user
app.get("/api/followers/:userId", (req,res)=>{
  const { userId } = req.params;
  db.all(`SELECT u.id, u.username FROM followers f JOIN users u ON f.followerId=u.id WHERE f.followingId=?`, [userId], (err, rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get following of a user
app.get("/api/following/:userId", (req,res)=>{
  const { userId } = req.params;
  db.all(`SELECT u.id, u.username FROM followers f JOIN users u ON f.followingId=u.id WHERE f.followerId=?`, [userId], (err, rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Notifications ---
// Get notifications for a user
app.get("/api/notifications/:userId", (req,res)=>{
  const { userId } = req.params;
  db.all("SELECT * FROM notifications WHERE userId=? ORDER BY createdAt DESC", [userId], (err, rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Mark notification as read
app.put("/api/notifications/:id", (req, res) => {
  const { id } = req.params;
  db.run("UPDATE notifications SET isRead=1 WHERE id=?", [id], function(err){
    if(err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});