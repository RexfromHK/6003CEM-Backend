const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); 
const connection = require('./api/db');

app.use('/uploads', express.static('uploads'));
app.use(cors());

const account = require('./api/account');
const cat = require('./api/cat');
const message = require('./api/message');
const favorite = require('./api/favorite');

app.use(bodyParser.json());
app.use('/api/account', account);
app.use('/api/cat', cat);
app.use('/api/message', message);
app.use('/api/favorite', favorite);



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
