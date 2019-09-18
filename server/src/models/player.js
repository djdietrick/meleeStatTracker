const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const playerSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    friends: [{
        friendId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
});

playerSchema.methods.generateAuthToken = async function () {
    const player = this;
    const token = jwt.sign({ _id: player._id.toString() }, process.env.JWT_SECRET);

    player.tokens = player.tokens.concat({ token });
    await player.save();

    return token;
};

playerSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

playerSchema.statics.findPlayerByName = async (name) => {
    const player = await Player.findOne({userName: name});

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