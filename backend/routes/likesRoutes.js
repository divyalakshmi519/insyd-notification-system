const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Like a post
  router.post('/', (req, res) => {
    const { userId, postId } = req.body;
    if (!userId || !postId) return res.status(400).json({ error: 'userId and postId required' });

    db.run(`INSERT INTO likes (userId, postId, type) VALUES (?, ?, 'like')`, [userId, postId], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // notify post owner
      db.get(`SELECT userId FROM posts WHERE id = ?`, [postId], (err, row) => {
        if (!err && row && row.userId !== userId) {
          db.run(`INSERT INTO notifications (senderId, receiverId, type) VALUES (?, ?, 'like')`, [userId, row.userId], (e) => {
            if (e) console.error('notif error', e.message);
          });
        }
      });

      res.json({ success: true, id: this.lastID });
    });
  });

  return router;
};
