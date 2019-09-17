const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

playerSchema.methods.generateAuthToken = async function () {
    const player = this;
    const token = jwt.sign({ _id: player._id.toString() }, process.env.JWT_SECRET);

    player.tokens = player.tokens.concat({ token });
    await player.save();

    return token;
}

playerSchema.statics.findPlayerByName = async (name) => {
    const player = Player.findOne({name});

    return player;
};

// Hash the plain text password before saving
playerSchema.pre('save', async function (next) {
    const player = this;

    if (player.isModified('password')) {
        player.password = await bcrypt.hash(player.password, 8);
    }

    next();
})

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;