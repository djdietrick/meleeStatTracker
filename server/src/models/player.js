const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    tag: {
        type: String
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
    }],
    pendingFriends: {
        sent: [{
            playerId: {
                type: mongoose.Schema.Types.ObjectId
            }
        }],
        received: [{
            playerId: {
                type: mongoose.Schema.Types.ObjectId
            }
        }]
    }
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

playerSchema.statics.findPlayerById = async (playerId) => {
    const player = await Player.findOne({playerId});

    return player;
};

playerSchema.statics.findPlayerByName = async (name) => {
    const player = await Player.findOne({username: name});

    return player;
};

playerSchema.statics.findByCredentials = async(username, password) => {
    const player = await Player.findOne({username});

    if(!player) {
        throw new Error('Could not find player with username', username);
    }

    const isMatch = await bcrypt.compare(password, player.password);

    if(!isMatch) {
        throw new Error('Invalid password!');
    }

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