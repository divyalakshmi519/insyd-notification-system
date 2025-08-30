const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all(`SELECT p.*, u.username FROM posts p JOIN users u ON u.id = p.userId ORDER BY p.createdAt DESC`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post('/', (req, res) => {
    const { userId, content } = req.body;
    if (!userId || !content) return res.status(400).json({ error: 'userId and content required' });

    db.run(`INSERT INTO posts (userId, content) VALUES (?, ?)`, [userId, content], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const postId = this.lastID;

      // Notify all followers that user posted (type = 'post')
      db.all(`SELECT followerId FROM followers WHERE followingId = ?`, [userId], (err, followers) => {
        if (!err && followers && followers.length) {
          followers.forEach(f => {
            db.run(`INSERT INTO notifications (senderId, receiverId, type) VALUES (?, ?, 'post')`, [userId, f.followerId], (e) => {
              if (e) console.error('notif error', e.message);
            });
          });
        }
      });

      res.json({ id: postId, userId, content });
    });
  });

  return router;
};
