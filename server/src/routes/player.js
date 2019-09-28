const express = require('express');
const Player = require('../models/player');
const auth = require('../middleware/auth');
let router = new express.Router();

router.post('/player/register', async(req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();

        const token = player.generateAuthToken();
        return res.status(201).send({player, token});
    } catch(e) {
        return res.status(400).send(e.message);
    }
});

router.post('/player/login', async(req, res) => {
    try {
        const player = await Player.findByCredentials(req.body.username, req.body.password);
        const token = await player.generateAuthToken();
        return res.status(200).send({player, token});
    } catch(e) {
        return res.status(400).send(e.message);
    }
});

router.post('/player/logout', auth, async(req, res) => {
    try {
        req.player.tokens = req.player.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.player.save();
    } catch(e) {
        res.status(500).send(e.message);
    }
})

module.exports = router;