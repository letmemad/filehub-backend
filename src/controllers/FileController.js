const File = require('../Models/File')
const User = require('../Models/User')
const mongoose = require('mongoose')

// gCloudStorage
const { Storage } = require('@google-cloud/storage')
const gCloud = new Storage({
    keyFilename: process.env.GCS_KEYFILENAME,
    projectId: process.env.GCS_PROJECTID
})
const bucket = gCloud.bucket('files-hot')

module.exports = {
    async index(req, res) {
        const files = await File.find({ author_id: req.user._id }).sort({ _id: -1 })
        return res.json({ files })
    },

    async create(req, res) {
        const file = req.file.gCloudFile
        const user = req.user
        if(!file) return res.status(400).json({ error: "Error, try again." })

        let format = req.file.originalname.split('.')
        const type = format.splice(-1)[0]

        const fileSaved = await File.create({
            author_id: user._id,
            name: file.name,
            originalname: req.file.originalname,
            size: file.size,
            type,
            url: file.mediaLink
        })

        return res.json({ fileSaved })
    },

    async show(req, res) {
        const { id } = req.params
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if(!isValidID) return res.status(400).json({ error: "Params with bad format." })

        const file = await File.findById(id)
        if(!file) return res.status(400).json({ error: "File not found." })
        const author = await User.findOne({ _id: file.author_id }, ['-_id', '-__v', '-password', '-createdAt', '-updatedAt', '-email'])

        return res.json({ file, author })
    },

    async update(req, res) {
        const { id } = req.params
        const file = await File.findOne({ _id: id })
        file.downloads = file.downloads + 1
        file.save()
        return res.send()
    },

    async delete(req, res) {
        const { id } = req.params
        const user = req.user

        const file = await File.findOne({ _id: id })
        if(file.author_id != user.id) return res.status(400).json({ 
            error: "Unauthorized"
        })

        const gcFile = bucket.file(file.name)
        gcFile.delete()
        file.remove()
        return res.send()
    }
}