const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, unique: true, required: true},
    houses: [{name: {type: String, required: true}, role: String, points: Number}],
    systems: {
        drops: {
            active: {type: Boolean, default: true},
            intervalID: String,
            duration: {type: Number, default: 1200},
            channels: Array,
            feedChannel: String
        }
    }
});

const model = mongoose.Model('Guilds', guildSchema)

module.exports = model