﻿const express = require('express');
const router = express.Router();
const connection = require('./db');

// add user
router.post('/user/add', (req, res) => {
    const { username, password, signupCode } = req.body;

    // 如果用戶名或密碼為空，則回應 'empty username or password'
    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    // 查詢 users 表中是否已存在該用戶名
    connection.query(
        'SELECT * FROM user WHERE username = ?',
        [username],
        (error, results, fields) => {
            if (error) throw error;

            // 如果查詢結果中存在該用戶名，則回應 'Username already exists'
            if (results.length > 0) {
                res.status(409).send('Username already exists');
            } else {
                // 否則，將用戶名和密碼插入 users 表中，回應 'SignUp Successfully'
                connection.query(
                    'INSERT INTO user (username, password) VALUES (?, ?)',
                    [username, password],
                    (error, results, fields) => {
                        if (error) throw error;
                        res.status(201).send('SignUp Successfully');
                    }
                );
            }
        }
    );
});


// user login
router.post('/user/login', (req, res) => {
    const { username, password } = req.body;

    // 如果用户名或密码为空，则返回错误响应
    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    // 查询用户表以查找具有给定用户名和密码的用户
    connection.query(
        'SELECT id FROM user WHERE username = ? AND password = ?',
        [username, password],
        (error, results, fields) => {
            if (error) throw error;

            // 如果查询结果为空，则用户名和密码不匹配
            if (results.length === 0) {
                res.status(401).send('Username or password incorrect');
            } else {
                // 如果查询结果非空，则用户名和密码匹配
                // 在这里可以返回 JWT 或其他登录凭据

                // 提取用户ID并将其发送回客户端
                const userId = results[0].id;
                res.status(200).send(`${userId}`);
            }
        }
    );

}); 

// add staff
router.post('/staff/add', (req, res) => {
    const { username, password, signupCode } = req.body;

    // 如果用戶名或密碼為空，則回應 'empty username or password'
    if (signupCode != "SHAPE") {
        res.status(401).send('Invalid SignUp Code');
        return;
    }

    // 如果用戶名或密碼為空，則回應 'empty username or password'
    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    // 查詢 staff 表中是否已存在該用戶名
    connection.query(
        'SELECT * FROM staff WHERE username = ?',
        [username],
        (error, results, fields) => {
            if (error) throw error;

            // 如果查詢結果中存在該用戶名，則回應 'Username already exists'
            if (results.length > 0) {
                res.status(409).send('Username already exists');
            } else {
                // 否則，將用戶名和密碼插入 staff 表中，回應 'SignUp Successfully'
                connection.query(
                    'INSERT INTO staff (username, password) VALUES (?, ?)',
                    [username, password],
                    (error, results, fields) => {
                        if (error) throw error;
                        res.status(201).send('SignUp Successfully');
                    }
                );
            }
        }
    );
});


// staff login
router.post('/staff/login', (req, res) => {
    const { username, password } = req.body;

    // 如果用户名或密码为空，则返回错误响应
    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    // 查询用户表以查找具有给定用户名和密码的用户
    connection.query(
        'SELECT id FROM staff WHERE username = ? AND password = ?',
        [username, password],
        (error, results, fields) => {
            if (error) throw error;

            // 如果查询结果为空，则用户名和密码不匹配
            if (results.length === 0) {
                res.status(401).send('Username or password incorrect');
            } else {
                // 如果查询结果非空，则用户名和密码匹配
                // 在这里可以返回 JWT 或其他登录凭据

                // 提取用户ID并将其发送回客户端
                const userId = results[0].id;
                res.status(200).send(`${userId}`);
            }
        }
    );

}); 

module.exports = router;
