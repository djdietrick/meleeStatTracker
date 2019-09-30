let express = require('express');
let https = require('https');
let path = require('path');
let fs = require('fs');
let bodyParser = require('body-parser');
let multer = require('multer');

let port = process.env.PORT;

const gameRouter = require('./routes/game');
const playerRouter = require('./routes/player');

// Connect to DB
require('../db/mongoose');

const publicDir = path.join(__dirname, '../../client/');

let app = express();

app.use(express.static(publicDir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', ['*']);
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.set('Access-Control-Allow-Headers', ['Content-Type','Authorization']);
    next();
});

app.use(gameRouter);
app.use(playerRouter);

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: publicDir});
});

const options = {
    key: fs.readFileSync(path.join(__dirname, '../certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../certs/server.cert'))
};
  

// let server = https.createServer(options, app);
// server.listen(process.env.PORT);
// console.log("I'm running on https://localhost:3000");

app.listen(port, () => {
    console.log('Server is up on http://localhost:' + port);
});

module.exports = app;
