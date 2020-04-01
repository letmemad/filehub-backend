const router = require('express').Router()
const gCloudUpload = require('./middlewares/googleStorage')
const mongoose = require('mongoose')
const fs = require('fs')

// Models
const File = require('./Models/File')

// Multer
const multer = require('multer')
const multerConfig = require('./config/multer')

router.post('/upload', multer(multerConfig).single('file'), gCloudUpload, async (req, res) => {
    const file = req.file.gCloudFile
    if(!file) return res.status(400).json({ error: "Error, try again." })

    const fileSaved = await File.create({
        name: file.name,
        originalname: req.file.originalname,
        size: file.size,
        type: file.contentType,
        url: file.mediaLink
    })

    return res.json({ fileSaved })
})

router.get('/info/:id', async (req, res) => {
    const { id } = req.params
    const isValidID = mongoose.Types.ObjectId.isValid(id)
    if(!isValidID) return res.status(400).json({ error: "Params with bad format." })

    const file = await File.findOne({ _id: id })
    if(!file) return res.status(400).json({ error: "File not found." })

    return res.json({ file })
})

module.exports = router