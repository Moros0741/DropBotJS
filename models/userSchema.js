const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: {type: String, required: true, unique: true},
    houseRole: String,
    houseName: String,
    nickname: String,
    birthday: String,
    points: {type: Number, default: 0},
    active: {type: Boolean, default: true},
    cooldowns: [{command: String, used: {type: Date, default: Date.now()}}]
});

let model = new mongoose.model("Users", userSchema)

module.exports = model