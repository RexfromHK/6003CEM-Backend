const express = require('express');
const router = express.Router();
const connection = require('./db');
const app = express();
const cors = require('cors'); 
app.use(cors());

// add message to db
router.post('/add', (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const query = `INSERT INTO message (sender_id, receiver_id, message) VALUES (?, ?, ?)`;
    connection.query(query, [senderId, receiverId, message], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: 'An error occurred' });
        } else {
            res.status(200).json({ message: 'Message sent' });
        }
    });
});

// get message from db
router.get('/get/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT * FROM message WHERE sender_id = ? OR receiver_id = ? order by created_at desc`;
    connection.query(query, [userId, userId], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: 'An error occurred' });
        } else {
            res.status(200).json(results);
        }
    });
});

// delete cat from db
router.delete('/delete/:messageid', (req, res) => {
    const messageid = req.params.messageid;
    const sql = 'DELETE FROM message WHERE id = ?';
    connection.query(sql, [messageid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to delete cat');

        } else {
            res.status(201).json({ message: `Cat with id ${messageid} has been deleted.` });
        }
    });
});


module.exports = router;
