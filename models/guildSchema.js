const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, unique: true, required: true},
    systems: {
        drops: {
            feedChannel: {type: String}
        },
        bean: {
            isActive: {type: Boolean, default: true},
            channel: {type: String},
            feedChannel: {type: String}
        }
    }
});

const model = new mongoose.model('Guilds', guildSchema);

module.exports = model