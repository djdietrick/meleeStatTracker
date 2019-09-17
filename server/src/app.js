let express = require('express');
let https = require('https');
let path = require('path');
let fs = require('fs');
let bodyParser = require('body-parser');

let port = process.env.PORT;

const gameRouter = require('./routes/game');

// Connect to DB
require('../db/mongoose');

const publicDir = path.join(__dirname, '../../client/');

let app = express();

app.use(express.static(publicDir));

//app.use(express.json());
app.use(bodyParser.json());
app.use(gameRouter);

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
    console.log('Server is up on port ' + port);
});
