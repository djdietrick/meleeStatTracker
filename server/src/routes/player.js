const express = require('express');
const Player = require('../models/player');
const auth = require('../middleware/auth');
let router = new express.Router();

router.post('/player/register', async(req, res) => {
    console.log("Received POST request to player/register, body:" , JSON.stringify(req.body));
    try {
        const player = new Player(req.body);
        await player.save();

        const token = player.generateAuthToken();

        console.log('Registration successful, returning player:', player);
        return res.status(201).send({player, token});
    } catch(e) {
        console.log('Registration error:', e.message);
        return res.status(400).send(e.message);
    }
});

router.post('/player/login', async(req, res) => {
    console.log("Received POST request to player/login, body:" , JSON.stringify(req.body));
    try {
        const player = await Player.findByCredentials(req.body.username, req.body.password);
        const token = await player.generateAuthToken();
        console.log('Login successful, returning player:', player);
        return res.status(200).send({player, token});
    } catch(e) {
        console.log('Login error:', e.message);
        return res.status(400).send(e.message);
    }
});

router.post('/player/logout', auth, async(req, res) => {
    console.log("Received POST request to player/logout, body:" , JSON.stringify(req.body));
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