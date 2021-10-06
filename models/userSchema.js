const mongoose = require('mongoose')

const userSchems = new mongoose.Schema({
    userID: {type: String, required: true, unique: true},
    houseRole: String,
    houseName: String,
    nickname: String,
    birthday: String,
    points: {type: Number, default: 0},
    active: {type: Boolean, default: true}
})

let model = mongoose.Model("Users", userSchema)

module.exports = model