const express = require('express');
const router = express.Router();
const connection = require('./db');

// signup control
router.post('/add', (req, res) => {
    const { username, password } = req.body;

    // �p�G�Τ�W�αK�X���šA�h�^�� 'empty username or password'
    if (!username || !password) {
        res.send('empty username or password');
        return;
    }

    // �d�� users ���O�_�w�s�b�ӥΤ�W
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, results, fields) => {
            if (error) throw error;

            // �p�G�d�ߵ��G���s�b�ӥΤ�W�A�h�^�� 'Username already exists'
            if (results.length > 0) {
                res.send('Username already exists');
            } else {
                // �_�h�A�N�Τ�W�M�K�X���J users ���A�^�� 'SignUp Successfully'
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

// �ɥX����
module.exports = router;