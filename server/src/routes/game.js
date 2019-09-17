const express = require('express');
const Game = require('../models/game');
let router = new express.Router();
let multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
     cb(null, 'src/slippi/uploads');
    },
    filename: function (req, file, cb) {
     cb(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ storage });

//router.post('/games/upload', upload.a)

router.post('/games', async(req, res) => {
    const game = new Game(req.body);

    try {
        await game.save();
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/games/:player_id', async(req, res) => {
    const id = req.params.player_id;

    const games = await Game.findGamesWithPlayer(id);

    return games;
});

module.exports = router;