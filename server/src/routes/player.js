const express = require('express');
const Player = require('../models/player');
const auth = require('../middleware/auth');
let router = new express.Router();

router.post('/player/new', async(req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();
        res.send(player.toJSON());
    } catch(e) {
        res.status(400).send(e.message);
    }
});

module.exports = router;