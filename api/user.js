const express = require('express');
const router = express.Router();
const connection = require('./db');

// signup control
router.post('/add', (req, res) => {
    const { username, password } = req.body;

    // 如果用戶名或密碼為空，則回應 'empty username or password'
    if (!username || !password) {
        res.send('empty username or password');
        return;
    }

    // 查詢 users 表中是否已存在該用戶名
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, results, fields) => {
            if (error) throw error;

            // 如果查詢結果中存在該用戶名，則回應 'Username already exists'
            if (results.length > 0) {
                res.send('Username already exists');
            } else {
                // 否則，將用戶名和密碼插入 users 表中，回應 'SignUp Successfully'
                connection.query(
                    'INSERT INTO users (username, password) VALUES (?, ?)',
                    [username, password],
                    (error, results, fields) => {
                        if (error) throw error;
                        res.send('SignUp Successfully');
                    }
                );
            }
        }
    );
});

// 導出路由
module.exports = router;