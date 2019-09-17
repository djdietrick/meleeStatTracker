const mongoose = require('mongoose');
const Player = require('./player');
const _ = require('lodash')

const gameSchema = new mongoose.Schema({
    playerOne: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    playerTwo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    stage: {
        type: String,
        required:true
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    playerOneCharacter: {
        type: String,
        required: true
    },
    playerTwoCharacter: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    }
});

gameSchema.statics.findByFileName = async (filename) => {
    const game = await Game.findOne({filename});
    return game;
};

gameSchema.statics.findGamesWithPlayer = async (id) => {
    const games = await Game.find({
        $or: [
            {'playerOne': id},
            {'playerTwo': id}
        ]
    });

    if(!games) {
        throw new Error('Could not find games for player with id ' + id);
    }

    return games;
};

gameSchema.statics.findGamesOnStage = async(playerId, stage) => {
    const gamesByPlayer = await Game.findGamesWithPlayer(playerId);

    const gamesOnStage = _.remove(gamesByPlayer, (game) => {
        return game.stage == stage;
    });

    return gamesOnStage;
};

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;