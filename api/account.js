const express = require('express');
const router = express.Router();
const connection = require('./db');
const crypto = require('crypto');
const api_secret = 'api';


// add user
router.post('/user/add', (req, res) => {
    const { username, password, signupCode } = req.body;

    // Check API secret
    const api_key = req.headers['api-key'];
    if (api_key !== api_secret) {
        res.status(401).send('Invalid API key');
        return;
    }

    // if username or password is empty ,it reply 'empty username or password'
    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    // use md5 to encryte the pw
    const md5password = crypto.createHash('md5').update(password).digest('hex');

    // check if the username already exists in the users table
    connection.query(
        'SELECT * FROM user WHERE username = ?',
        [username],
        (error, results, fields) => {
            if (error) throw error;

            // If the username exists in the query results, respond with 'Username already exists'
            if (results.length > 0) {
                res.status(409).send('Username already exists');
            } else {
                // Otherwise, insert the username and password into the users table, responding with 'SignUp Successfully'
                connection.query(
                    'INSERT INTO user (username, password) VALUES (?, ?)',
                    [username, md5password],
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



    // Returns an error response if the username or password is empty
    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    // use md5 to encryte the pw
    const md5password = crypto.createHash('md5').update(password).digest('hex');

    // Query the user table to find a user with a given username and encrypted password
    connection.query(
        'SELECT id FROM user WHERE username = ? AND password = ?',
        [username, md5password],
        (error, results, fields) => {
            if (error) throw error;

            // If the query result is empty, the username and password do not match
            if (results.length === 0) {
                res.status(401).send('Username or password incorrect');
            } else {
                // get the user id and send it back to the client
                const userId = results[0].id;
                res.status(200).send(`${userId}`);
            }
        }
    );

});


// add staff
router.post('/staff/add', (req, res) => {
    const { username, password, signupCode } = req.body;

    if (signupCode != "SHAPE") {
        res.status(401).send('Invalid SignUp Code');
        return;
    }

    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    connection.query(
        'SELECT * FROM staff WHERE username = ?',
        [username],
        (error, results, fields) => {
            if (error) throw error;

            if (results.length > 0) {
                res.status(409).send('Username already exists');
            } else {
                const encryptedPassword = crypto.createHash('md5').update(password).digest('hex');

                connection.query(
                    'INSERT INTO staff (username, password) VALUES (?, ?)',
                    [username, encryptedPassword],
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

    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }

    const encryptedPassword = crypto.createHash('md5').update(password).digest('hex');


    connection.query(
        'SELECT id FROM staff WHERE username = ? AND password = ?',
        [username, encryptedPassword],
        (error, results, fields) => {
            if (error) throw error;


            if (results.length === 0) {
                res.status(401).send('Username or password incorrect');
            } else {

                const userId = results[0].id;
                res.status(200).send(`${userId}`);
            }
        }
    );

});



// staff login
router.post('/staff/login', (req, res) => {
    const { username, password } = req.body;


    if (!username || !password) {
        res.status(400).send('Empty username or password');
        return;
    }


    const md5Password = crypto.createHash('md5').update(password).digest('hex');


    connection.query(
        'SELECT id FROM staff WHERE username = ? AND password = ?',
        [username, md5Password],
        (error, results, fields) => {
            if (error) throw error;

            if (results.length === 0) {
                res.status(401).send('Username or password incorrect');
            } else {

                const userId = results[0].id;
                res.status(200).send(`${userId}`);
            }
        }
    );

});

module.exports = router;
