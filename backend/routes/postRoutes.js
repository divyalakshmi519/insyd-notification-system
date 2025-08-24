// const express = require("express");
// module.exports = (db) => {
//   const router = express.Router();

//   // get posts with likes/dislikes/comments
//   router.get("/", (req, res) => {
//     db.all("SELECT * FROM posts", [], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });

//       const posts = [];
//       let remaining = rows.length;
//       if (remaining === 0) return res.json([]);

//       rows.forEach((post) => {
//         const postObj = { ...post, likes: 0, dislikes: 0, comments: [] };

//         db.get("SELECT COUNT(*) as cnt FROM likes WHERE post_id=?", [post.id], (err, r) => {
//           postObj.likes = r.cnt;
//           db.get("SELECT COUNT(*) as cnt FROM dislikes WHERE post_id=?", [post.id], (err, r2) => {
//             postObj.dislikes = r2.cnt;
//             db.all("SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id=u.id WHERE post_id=?", [post.id], (err, cmt) => {
//               postObj.comments = cmt || [];
//               posts.push(postObj);
//               remaining--;
//               if (remaining === 0) res.json(posts);
//             });
//           });
//         });
//       });
//     });
//   });

//   // create post
//   router.post("/", (req, res) => {
//     const { user_id, content } = req.body;
//     db.run("INSERT INTO posts (user_id, content) VALUES (?, ?)", [user_id, content], function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ id: this.lastID, user_id, content });
//     });
//   });

//   // like
//   router.post("/:id/like", (req, res) => {
//     db.run("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [req.params.id, req.body.user_id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ success: true });
//     });
//   });

//   // dislike
//   router.post("/:id/dislike", (req, res) => {
//     db.run("INSERT INTO dislikes (post_id, user_id) VALUES (?, ?)", [req.params.id, req.body.user_id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ success: true });
//     });
//   });

//   // comment
//   router.post("/:id/comment", (req, res) => {
//     db.run("INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)", [req.params.id, req.body.user_id, req.body.text], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ success: true });
//     });
//   });

//   return router;
// };

const express = require("express");
module.exports = (db) => {
  const router = express.Router();

  router.get("/", (req,res)=>{
    db.all(`SELECT p.*, u.username FROM posts p JOIN users u ON u.id=p.userId ORDER BY createdAt DESC`, [], (err, rows)=>{
      if(err) return res.status(500).json({error: err.message});
      res.json(rows);
    });
  });

  router.post("/", (req,res)=>{
    const { userId, content } = req.body;
    db.run(`INSERT INTO posts (userId, content) VALUES (?, ?)`, [userId, content], function(err){
      if(err) return res.status(500).json({error: err.message});
      // Add notification
      db.run(`INSERT INTO notifications (userId, message) VALUES (?, ?)`, [userId, `You created a new post`]);
      res.json({ id: this.lastID, userId, content });
    });
  });

  return router;
};
