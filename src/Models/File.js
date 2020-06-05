const mongoose = require('mongoose')
const { Schema } = mongoose

const FileSchema = new Schema({
    author_id: mongoose.Schema.Types.ObjectId,
    size: Number,
    name: String,
    originalname: String,
    type: String,
    url: String,
    downloads: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('File', FileSchema)