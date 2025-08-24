// const express = require('express');
// const router = express.Router();

// router.post('/', (req, res) => {
//     const { user_id, message } = req.body;
//     const db = req.db;

//     db.run(
//         "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
//         [user_id, message],
//         function(err) {
//             if (err) {
//                 return res.status(400).json({ error: err.message });
//             }
//             res.status(201).json({ id: this.lastID, user_id, message });
//         }
//     );
// });

// router.get('/', (req, res) => {
//     const db = req.db;

//     db.all("SELECT * FROM notifications", [], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(rows);
//     });
// });

// module.exports = router;

const express = require("express");
module.exports = (db)=>{
  const router = express.Router();

  router.get("/:userId", (req,res)=>{
    const { userId } = req.params;
    db.all(`SELECT * FROM notifications WHERE userId=? ORDER BY createdAt DESC`, [userId], (err,rows)=>{
      if(err) return res.status(500).json({error: err.message});
      res.json(rows);
    });
  });

  return router;
};
