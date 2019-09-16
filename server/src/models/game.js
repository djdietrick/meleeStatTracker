const mongoose = require('mongoose')

const Game = mongoose.model('Game', {
    playerOne: {
        type: Schema.Types.ObjectId,
        required: true
    },
    playerTwo: {
        type: Schema.Types.ObjectId,
        required: true
    },
    stage: {
        type: String,
        required:true
    },
    winner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    playerOneCharacter: {
        type: String,
        required: true
    },
    playerTwoCharacter: {
        type: String,
        required: true
    }
})

module.exports = Game