const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, unique: true, required: true},
    houses: {
        gryffindor: {
            roleID: String,
            points: Number,
            announcements: String,
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        hufflepuff: {
            roleID: String,
            points: Number,
            announcements: String, 
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        ravenclaw: {
            roleID: String,
            points: Number,
            announcements: String,
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        slytherin: {
            roleID: String,
            points: Number,
            announcements: String,
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        }
    },
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