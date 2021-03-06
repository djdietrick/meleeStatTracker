const express = require('express');
const Game = require('../models/game');
const Player = require('../models/player');
let router = new express.Router();
let multer = require('multer');
let fs = require('fs');
let path = require('path');
let {convertFile} = require('../slippi/convert');
const auth = require('../middleware/auth');
let _ = require('lodash');

const pathToUploads = path.join(__dirname, '../slippi/uploads/');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
     cb(null, 'src/slippi/uploads');
    },
    filename: function (req, file, cb) {
     cb(null, file.originalname);
    },
    fileFilter: function(req, file, cb) {
        if(!file.originalname.match(/\.(slp)&/)) {
            return cb(new Error('Please upload only slippi files (.slp).'));
        }
        cb(undefined, true);
    }
});

var upload = multer({ storage });

router.post('/games', async(req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
    } catch(e) {
        res.status(400).send(e.message);
    }
});

router.post('/games/upload', upload.any(), async(req, res) => {
    console.log("Received POST request to games/upload, body:" , JSON.stringify(req.body));
    try {
        const players = JSON.parse(req.body.players);

        // Get playerIds
        for(var i = 0; i < players.length; i++) {
            const playerData = await Player.findPlayerByName(players[i].username);
            players[i].playerId = playerData._id;
        }

        //console.log(req.files);
        let games = [];
        req.files.forEach((file) => {
            const game = convertFile(file.originalname);
            fs.unlinkSync(path.join(pathToUploads, file.originalname));

            // Figure out which player is which based on port or tag given
            game.players.forEach((player) => {
                const getPlayerIdFromMe = players.find((tempPlayer) => {
                    return tempPlayer.port === player.port ||
                        tempPlayer.tag === player.tag;
                });
                player.playerId = getPlayerIdFromMe.playerId;
            });

            // Set winner playerId
            game.winner.playerId = players.find((tempPlayer) => {
                return tempPlayer.port === game.winner.port ||
                        tempPlayer.tag === game.winner.tag;
            }).playerId;
            game.winnerPlayerId = game.winner.playerId;

            games.push(game);
        });
        
        for(var i = 0; i < games.length; i++) {
            try {
                await new Game(games[i]).save();
            } catch(e) {
                console.log("Error when saving game: ", e.message);
                return res.status(500).send(e.message);
            }
        }
        
        return res.status(200).send(games);
    } catch(e) {
        console.log("Error when parsing files: ", e.message);
        return res.status(400).send(e.message);
    }
});

router.post('/games/check', async(req, res) => {
    try {
        const games = req.body.games;
        let alreadyExist = [];
        games.forEach((game) => {
            Game.findByFileName(game).then((exists) => {
                if(exists) {
                    alreadyExist.push(game);
                }
            });
        });
        return res.status(200).send(alreadyExist);
    } catch(e) {
        return res.status(400).send(e.message);
    }
});

router.post('/games/:player_id', auth, async(req, res) => {
    console.log("Received POST request to player/games/:playerId, body:" , JSON.stringify(req.body));
    const games = await Game.findGamesWithPlayer(req.body.player._id);

    return games;
});

module.exports = router;