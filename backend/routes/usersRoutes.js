const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Create user
  router.post('/', (req, res) => {
    const { username, email } = req.body; 
    if (!username) return res.status(400).json({ error: 'username required' });

    db.run(
      `INSERT INTO users (username, email) VALUES (?, ?)`,
      [username, email || null],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get(`SELECT id, username, email FROM users WHERE id = ?`, [this.lastID], (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(row);
        });
      }
    );
  });

  // Get all users with follower/following counts
  router.get('/', (req, res) => {
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

  // Get single user with counts
  router.get('/:id', (req, res) => {
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

  // ---- NEW: Get users this user is following ----
  router.get('/:id/following', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT u.id, u.username
      FROM followers f
      JOIN users u ON f.followingId = u.id
      WHERE f.followerId = ?
    `;
    db.all(query, [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // ---- NEW: Get users who follow this user ----
  router.get('/:id/followers', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT u.id, u.username
      FROM followers f
      JOIN users u ON f.followerId = u.id
      WHERE f.followingId = ?
    `;
    db.all(query, [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  return router;
};
