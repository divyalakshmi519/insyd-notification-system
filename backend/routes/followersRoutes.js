const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.use(express.json());

  // Get followers of a user
  router.get("/:userId/followers", (req, res) => {
    const { userId } = req.params;
    db.all(
      `SELECT u.id, u.username
       FROM followers f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = ?`,
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // Get following of a user
  router.get("/:userId/following", (req, res) => {
    const { userId } = req.params;
    db.all(
      `SELECT u.id, u.username
       FROM followers f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = ?`,
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // Follow a user
  router.post("/follow", (req, res) => {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId)
      return res.status(400).json({ error: "followerId and followingId are required" });

    if (followerId === followingId)
      return res.status(400).json({ error: "Cannot follow yourself" });

    db.get(
      "SELECT * FROM followers WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId],
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(400).json({ error: "Already following" });

        db.run(
          "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)",
          [followerId, followingId],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: "Followed successfully" });
          }
        );
      }
    );
  });

  // Unfollow a user
  router.post("/unfollow", (req, res) => {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      console.error("Invalid unfollow body:", req.body);
      return res.status(400).json({ error: "followerId and followingId are required" });
    }

    db.run(
      "DELETE FROM followers WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId],
      function (err) {
        if (err) {
          console.error("SQLite error on unfollow:", err);
          return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0)
          return res.status(404).json({ error: "Follow relation not found" });

        res.json({ message: "Unfollowed successfully" });
      }
    );
  });

  return router;
};
