const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get notifications for a user (with sender username)
  router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    db.all(
      `SELECT n.id, n.type, n.isRead, n.createdAt, u.username as senderName
       FROM notifications n
       LEFT JOIN users u ON n.senderId = u.id
       WHERE n.receiverId = ?
       ORDER BY n.createdAt DESC`,
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const formatted = rows.map((n) => ({
          ...n,
          message:
            n.type === 'like'
              ? `${n.senderName} liked your post`
              : n.type === 'follow'
              ? `${n.senderName} started following you`
              : n.type === 'post'
              ? `${n.senderName} created a new post`
              : `${n.senderName} did something`,
        }));

        res.json(formatted);
      }
    );
  });

  // mark a notification read
  router.post('/mark-read', (req, res) => {
    const { notificationId } = req.body;
    if (!notificationId) return res.status(400).json({ error: 'notificationId required' });

    db.run(`UPDATE notifications SET isRead = 1 WHERE id = ?`, [notificationId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, changed: this.changes });
    });
  });

  return router;
};
