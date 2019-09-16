const express = require('express');
const Game = require('../models/game');
let router = new express.Router();

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