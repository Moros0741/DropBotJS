const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, unique: true, required: true},
    systems: {
        drops: {
            feedChannel: String
        }
    }
});

const model = new mongoose.model('Guilds', guildSchema);

module.exports = model