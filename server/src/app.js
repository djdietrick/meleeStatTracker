let express = require('express');
let https = require('https');
let path = require('path');

let port = process.env.PORT;

const gameRouter = require('./routes/game');

// Connect to DB
require('../db/mongoose');

const publicDir = path.join(__dirname, '../../client/');

let app = express();

app.use(express.json());
app.use(gameRouter);

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: publicDir});
});

//let server = https.createServer(app);
//server.listen(process.env.PORT);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})