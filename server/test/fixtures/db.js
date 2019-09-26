const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Player = require('../../src/models/player');
const Game = require('../../src/models/game');

const password = 'test123'

const daveId = new mongoose.Types.ObjectId();
const dave = {
    _id: daveId,
    username: 'Dave',
    email: 'djdietrick@gmail.com',
    password,
    tokens: [{
        token: jwt.sign({_id: daveId }, process.env.JWT_SECRET)
    }]
}

const tomId = new mongoose.Types.ObjectId();
const tom = {
    _id: tomId,
    username: 'Tom',
    email: 'tom@gmail.com',
    password,
    tokens: [{
        token: jwt.sign({_id: tomId }, process.env.JWT_SECRET)
    }]
}

const donnyId = new mongoose.Types.ObjectId();
const donny = {
    _id: donnyId,
    username: 'Donny',
    email: 'donny@gmail.com',
    password,
    tokens: [{
        token: jwt.sign({_id: donnyId }, process.env.JWT_SECRET)
    }]
}

const mangoId = new mongoose.Types.ObjectId();
const mango = {
    _id: mangoId,
    username: 'Mango',
    email: 'mango@gmail.com',
    password,
    tokens: [{
        token: jwt.sign({_id: mangoId }, process.env.JWT_SECRET)
    }]
}

const setupPlayers = async () => {
    await Player.deleteMany();
    await new Player(dave).save();
    await new Player(tom).save();
    await new Player(donny).save();
    await new Player(mango).save();
}

const deleteGames = async () => {
    await Game.deleteMany();
}

module.exports = {
    dave,
    tom,
    donny,
    mango,
    daveId,
    tomId,
    donnyId,
    mangoId,
    setupPlayers,
    deleteGames
}