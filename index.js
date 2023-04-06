const express = require('express');
const bodyParser = require('body-parser');
const user = require('./api/user');
const app = express();
const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

app.use('/api/user', user);


app.listen(3001, () => {
    console.log('Server is running on port 3000');
});
