const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    picture_url: {
        type: String,
        default: "https://i.imgur.com/9U9PNeT.jpg"
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)