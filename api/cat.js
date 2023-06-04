const express = require('express');
const router = express.Router();
const connection = require('./db');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');
const api_secret = '6003CEM';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create Multer file upload middleware
const upload = multer({ dest: 'uploads/' });

app.put('test/:catid', (req, res) => {
    //  handle PUT requests
});


// add cat
router.post('/add', upload.single('image'), async (req, res) => {

    // Check API secret
    const api_key = req.headers['api-key'];
    if (api_key !== api_secret) {
        res.status(401).send('Invalid API key');
        return;
    }

    const { name, age, breed, location } = req.body;
    const userId = req.body.userId;
    const image = req.file.filename;

    if (!name || !age || !image ||  !location) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const query = 'INSERT INTO cat (name, age, image, breed, location, status) VALUES ( ?, ?, ?, ?, ?, ?)';
        const values = [name, age, image, breed, location, 'available'];

        await connection.query(query, values);
        res.status(201).send('Cat added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// get all cat
router.get('/getallcat/:userId', (req, res) => {
    const staffId = req.params.userId;
    const sql = `SELECT * from cat`;
    connection.query(sql,  (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get cat by id
router.get('/getcat/:catid', (req, res) => {
    const catid = req.params.catid;
    const sql = `SELECT * from cat WHERE id = ?`;
    connection.query(sql, [catid], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get cat by search
router.get('/search', (req, res) => {
    const { name, age, breed, status, location } = req.query;
    const query = `SELECT * FROM cat 
                 WHERE name LIKE '%${name}%' 
                   AND age LIKE '%${age}%' 
                   AND Breed LIKE '%${breed}%' 
                   AND status LIKE '%${status}%' 
                   AND location LIKE '%${location}%'`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        return res.json(results);
    });
});


// delete cat
router.delete('/delete/:catid', (req, res) => {
    const catid = req.params.catid;
    const sql = 'DELETE FROM cat WHERE id = ?';
    connection.query(sql, [catid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to delete cat');

        } else {
            res.status(201).json({ message: `Cat with id ${catid} has been deleted.` });
        }
    });
});

// update cat
router.put('/update/:catid', (req, res) => {
    const catid = req.params.catid;
    const updatedCat = req.body;
    const sql = `UPDATE cat SET name = ?, age = ?, image = ?, Breed = ?, location = ?, status = ? WHERE id = ?`;
    const values = [updatedCat.name, updatedCat.age, updatedCat.image, updatedCat.Breed, updatedCat.location, updatedCat.status, catid];

    connection.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} record(s) updated`);
        res.send(result);
    });
});

module.exports = router;
