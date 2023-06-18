// connect to mysql
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cat'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

module.exports = connection;