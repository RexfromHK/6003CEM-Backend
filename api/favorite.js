const express = require('express');
const router = express.Router();
const connection = require('./db');

// add favorite
router.post('/add', (req, res) => {
    const { catid, userId } = req.body;
    console.log(catid);
    // Query whether the catid already exists in the favorite table
    connection.query(
        'SELECT * FROM favorite WHERE cat_id = ?',
        [catid],
        (error, results, fields) => {
            if (error) throw error;

            // If the cat exists in the query result, respond with 'cat already exists'
            if (results.length > 0) {
                res.status(409).send('cat already exists');
            } else {
                // Otherwise, insert the username and password into the favorite table, responding with 'add favorite Successfully'
                connection.query(
                    'INSERT INTO favorite (cat_id, user_id) VALUES (?, ?)',
                    [catid, userId],
                    (error, results, fields) => {
                        if (error) throw error;
                        res.status(201).send('add favorite Successfully');
                    }
                );
            }
        }
    );
});

// get favorite by userid
router.get('/getallcat/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT favorite.id AS favorite_id, cat.* FROM favorite INNER JOIN cat ON favorite.cat_id = cat.id WHERE favorite.user_id = ?`;
    connection.query(sql, [userId], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// delete cat
router.delete('/delete/:favoriteid', (req, res) => {
    const favoriteid = req.params.favoriteid;
    console.log(favoriteid);
    const sql = 'DELETE FROM favorite WHERE id = ?';
    connection.query(sql, [favoriteid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to delete cat');

        } else {
            res.status(201).json({ message: `Cat with id ${favoriteid} has been deleted.` });
        }
    });
});


module.exports = router;
