const mongoose = require('mongoose')

const Player = mongoose.model('Player', {
    name: {
        type: String,
        required: true
    }
})

module.exports = Player