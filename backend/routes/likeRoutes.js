const express = require("express");
module.exports = (db)=>{
  const router = express.Router();

  router.post("/", (req,res)=>{
    const { userId, postId, type } = req.body;
    db.run(`INSERT INTO likes (userId, postId, type) VALUES (?,?,?)`, [userId, postId, type], function(err){
      if(err) return res.status(500).json({error: err.message});
      // Add notification to post owner
      db.get(`SELECT userId FROM posts WHERE id=?`, [postId], (err,row)=>{
        if(row && row.userId!==userId){
          db.run(`INSERT INTO notifications (userId, message) VALUES (?,?)`, [row.userId, `User ${userId} ${type}d your post`]);
        }
      });
      res.json({ success:true });
    });
  });

  return router;
};
