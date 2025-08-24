// const express = require('express');
// const router = express.Router();

// router.post('/', (req, res) => {
//     const { followerId, followeeId } = req.body;
    
//     console.log('Follow request received:', { followerId, followeeId });

//     if (!followerId || !followeeId) {
//         return res.status(400).json({ 
//             error: 'Both followerId and followeeId are required',
//             received: req.body 
//         });
//     }

//     if (followerId === followeeId) {
//         return res.status(400).json({ error: 'Cannot follow yourself' });
//     }

//     // Check if already following
//     req.db.get(
//         'SELECT * FROM follows WHERE followerId = ? AND followeeId = ?',
//         [followerId, followeeId],
//         (err, row) => {
//             if (err) {
//                 console.error('Database error in SELECT:', err.message);
//                 return res.status(500).json({ error: err.message });
//             }
            
//             if (row) {
//                 return res.status(400).json({ error: 'Already following this user' });
//             }

//             // Create follow relationship
//             req.db.run(
//                 'INSERT INTO follows (followerId, followeeId) VALUES (?, ?)',
//                 [followerId, followeeId],
//                 function(err) {
//                     if (err) {
//                         console.error('Database error in INSERT:', err.message);
//                         return res.status(500).json({ error: err.message });
//                     }

//                     console.log('Follow created successfully with ID:', this.lastID);
                    
//                     res.status(201).json({
//                         id: this.lastID,
//                         followerId,
//                         followeeId,
//                         message: 'Follow relationship created successfully'
//                     });
//                 }
//             );
//         }
//     );
// });

// router.get('/', (req, res) => {
//     req.db.all('SELECT * FROM follows', [], (err, rows) => {
//         if (err) {
//             console.error('Database error in GET:', err.message);
//             return res.status(500).json({ error: err.message });
//         }
//         console.log('Returning follows data:', rows);
//         res.json(rows);
//     });
// });

// module.exports = router;

const express = require("express");
module.exports = (db)=>{
  const router = express.Router();

  router.post("/", (req,res)=>{
    const { followerId, followingId } = req.body;
    // toggle follow/unfollow
    db.get(`SELECT * FROM followers WHERE followerId=? AND followingId=?`, [followerId, followingId], (err,row)=>{
      if(err) return res.status(500).json({error: err.message});
      if(row){
        db.run(`DELETE FROM followers WHERE id=?`, [row.id], function(err){
          if(err) return res.status(500).json({error: err.message});
          res.json({action:"unfollowed"});
        });
      } else {
        db.run(`INSERT INTO followers (followerId, followingId) VALUES (?,?)`, [followerId, followingId], function(err){
          if(err) return res.status(500).json({error: err.message});
          // Add notification for followee
          db.run(`INSERT INTO notifications (userId, message) VALUES (?, ?)`, [followingId, `User ${followerId} started following you`]);
          res.json({action:"followed"});
        });
      }
    });
  });

  router.get("/followers/:userId", (req,res)=>{
    const { userId } = req.params;
    db.all(`SELECT u.* FROM followers f JOIN users u ON u.id=f.followerId WHERE f.followingId=?`, [userId], (err,rows)=>{
      if(err) return res.status(500).json({error: err.message});
      res.json(rows);
    });
  });

  router.get("/following/:userId", (req,res)=>{
    const { userId } = req.params;
    db.all(`SELECT u.* FROM followers f JOIN users u ON u.id=f.followingId WHERE f.followerId=?`, [userId], (err,rows)=>{
      if(err) return res.status(500).json({error: err.message});
      res.json(rows);
    });
  });

  return router;
};
