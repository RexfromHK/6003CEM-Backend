const express = require('express');
const router = express.Router();
const connection = require('./db');

// add user
router.post('/add', (req, res) => {
    const { catid, userId } = req.body;
    console.log(catid);
    // 查詢 favorite 表中是否已存在該catid
    connection.query(
        'SELECT * FROM favorite WHERE cat_id = ?',
        [catid],
        (error, results, fields) => {
            if (error) throw error;

            // 如果查詢結果中存在該cat，則回應 'cat already exists'
            if (results.length > 0) {
                res.status(409).send('cat already exists');
            } else {
                // 否則，將用戶名和密碼插入 favorite 表中，回應 'add favorite Successfully'
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
