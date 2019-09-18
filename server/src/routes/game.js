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
     //console.log(file.originalname);
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
    try {
        const players = JSON.parse(req.body.players);

        // Get playerIds
        // players.forEach((player) => {
        //     const playerData = Player.findPlayerByName(player.userName);
        //     player.playerId = playerData._id;
        // });
        for(var i = 0; i < players.length; i++) {
            const playerData = await Player.findPlayerByName(players[i].userName);
            players[i].playerId = playerData._id;
        }


        console.log(req.files);
        let games = [];
        req.files.forEach((file) => {
            const game = convertFile(file.originalname);
            fs.unlinkSync(path.join(pathToUploads, file.originalname));

            game.players.forEach((player) => {
                const getPlayerIdFromMe = players.find((tempPlayer) => {
                    return tempPlayer.port === player.port ||
                        tempPlayer.tag === player.tag;
                });
                player.playerId = getPlayerIdFromMe.playerId;
            });

            game.winner.playerId = players.find((tempPlayer) => {
                return tempPlayer.port === game.winner.port ||
                        tempPlayer.tag === game.winner.tag;
            }).playerId;

            games.push(game);
        });
        //console.log(games);
        
        return res.status(200).send(games);
    } catch(e) {
        return res.status(400).send(e.message);
    }
});

router.post('/games/check', async(req, res) => {
    try {
        const games = req.games;
        let alreadyExist = [];
        games.forEach((game) => {
            if(Game.findByFileName(game)) {
                alreadyExist.push(game);
            }
        })
        return res.status(200).send(alreadyExist);
    } catch(e) {
        return res.status(400).send(e.message);
    }
});

router.get('/games/:player_id', async(req, res) => {
    const id = req.params.player_id;

    const games = await Game.findGamesWithPlayer(id);

    return games;
});

module.exports = router;