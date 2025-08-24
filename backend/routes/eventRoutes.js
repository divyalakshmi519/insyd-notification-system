const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { name, description, date } = req.body;
    const db = req.db;

    db.run(
        "INSERT INTO events (name, description, date) VALUES (?, ?, ?)",
        [name, description, date],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, description, date });
        }
    );
});

router.get('/', (req, res) => {
    const db = req.db;

    db.all("SELECT * FROM events", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
