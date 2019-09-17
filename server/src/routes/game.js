const express = require('express');
const Game = require('../models/game');
let router = new express.Router();
let multer = require('multer');
let fs = require('fs');
let path = require('path');
let {convertFile} = require('../slippi/convert');
const auth = require('../middleware/auth');

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
        res.status(400).send(e);
    }
});

router.post('/games/upload', upload.any(), async(req, res) => {
    try {
        // for(let file in req.files) {
        //     // if(!Game.findByFileName(file.originalname)) {
        //         const game = convertFile(file.originalname);
        //     // }
        //     fs.unlinkSync(path.join(pathToUploads, file.originalname));
        // }
        console.log(req.body);
        console.log(req.files);
        let games = [];
        req.files.forEach((file) => {
            const game = convertFile(file.originalname);
            games.push(game);
            fs.unlinkSync(path.join(pathToUploads, file.originalname));
        });
        //console.log(games);
        
        return res.status(200).send(games);
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