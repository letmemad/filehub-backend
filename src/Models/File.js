const mongoose = require('mongoose')
const { Schema } = mongoose

const FileSchema = new Schema({
    size: Number,
    name: String,
    originalname: String,
    type: String,
    url: String,
    info: [{
        likes: Number,
        dislikes: Number
    }]
})

module.exports = mongoose.model('File', FileSchema)