
const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Create user
  router.post("/", (req, res) => {
    const { username, email } = req.body;
    db.run(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [username, email],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, username, email });
      }
    );
  });

  // Get ALL users (with counts)
  router.get("/", (req, res) => {
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
  router.get("/:id", (req, res) => {
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

  // Get followers of a user
  router.get("/followers/:userId", (req, res) => {
    const { userId } = req.params;
    db.all(
      `SELECT u.id, u.username FROM followers f
       JOIN users u ON f.followerId = u.id
       WHERE f.followingId = ?`,
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // Get following of a user
  router.get("/following/:userId", (req, res) => {
    const { userId } = req.params;
    db.all(
      `SELECT u.id, u.username FROM followers f
       JOIN users u ON f.followingId = u.id
       WHERE f.followerId = ?`,
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  return router;
};