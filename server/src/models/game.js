const mongoose = require('mongoose');
const Player = require('./player');
const _ = require('lodash')

const gameSchema = new mongoose.Schema({
    players: [{
        playerId: {
            type:mongoose.Schema.Types.ObjectId
        },
        character: {
            id: {
                type: Number,
                required: true
            },
            colorId: {
                type: Number
            }
        }
    }],
    stageId: {
        type: Number,
        required:true
    },
    winnerPlayerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
});

// gameSchema.index({
//     filename: 1,
//     "players.playerId": 1   
// }, {
//     unique: true
// });

gameSchema.indexes({
    filename: 1,
    "players.playerId": 1   
}, {
    unique: true
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

    // Probably not needed
    // if(!games) {
    //     throw new Error('Could not find games for player with id ' + id);
    // }

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