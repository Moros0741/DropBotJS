const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildID: {type: String, unique: true, required: true},
    houses: {
        gryffindor: {
            name: {type: String, default: "Gryffindor"},
            includeMinistry: {type: Boolean, default: false},
            roleID: String,
            points: Number,
            announcements: String,
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        hufflepuff: {
            name: {type: String, default: "Hufflepuff"},
            includeMinistry: {type: Boolean, default: false},
            roleID: String,
            points: Number,
            announcements: String, 
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        ravenclaw: {
            name: {type: String, default: "Ravenclaw"},
            includeMinistry: {type: Boolean, default: false},
            roleID: String,
            points: Number,
            announcements: String,
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        slytherin: {
            name: {type: String, default: "Slytherin"},
            includeMinistry: {type: Boolean, default: false},
            roleID: String,
            points: Number,
            announcements: String,
            channelID: String,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        },
        ministry: {
            name: {type: String, default: "Ministry of Magic"},
            roleID: String,
            points: Number,
            auditLog: [{date: Date, amount: Number, addedBy: String, reason: String}]
        }
    },
    systems: {
        drops: {
            active: {type: Boolean, default: true},
            channelID: String,
            channels: Array,
            feedChannel: String,
            types: {
                festiveDrop: {
                    isActive: {type: Boolean, default: false},
                    messageID: String,
                    channelID: String,
                    posted: Date
                },
                trolleyWitch: {
                    isActive: {type: Boolean, default: false},
                    messageID: String,
                    channelID: String,
                    posted: Date
                }
            }
        }
    }
});

const model = mongoose.Model('Guilds', guildSchema)

module.exports = model